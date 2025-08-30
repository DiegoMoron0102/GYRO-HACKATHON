import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder
} from '@stellar/stellar-sdk';
import { ADMIN_CONFIG } from './adminConfig';

// Interface para balances de Stellar
interface BalanceResponse {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilities?: boolean;
  last_modified_ledger?: number;
  sponsor?: string;
}

// Interface para pagos de Stellar
interface PaymentRecord {
  id: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  created_at: string;
}

// Servidor Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export interface DepositRequest {
  userPublicKey: string;
  amount: number; // Cantidad en USDC
  description?: string;
}

export interface DepositResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  userAccount?: string;
  amount?: string;
}

export interface UserAccountInfo {
  publicKey: string;
  hasTrustline: boolean;
  usdcBalance: string;
  xlmBalance: string;
  isActive: boolean;
}

export class DepositService {
  private adminKeypair: Keypair;
  private usdcAsset: Asset;

  constructor() {
    this.adminKeypair = Keypair.fromSecret(ADMIN_CONFIG.SECRET_KEY);
    this.usdcAsset = new Asset(ADMIN_CONFIG.USDC_ASSET_CODE, ADMIN_CONFIG.USDC_ISSUER);
  }

  /**
   * Verificar el estado de una cuenta de usuario
   */
  async checkUserAccount(publicKey: string): Promise<UserAccountInfo> {
    try {
      const account = await server.loadAccount(publicKey);
      
      const usdcBalance = account.balances.find(
        (balance: BalanceResponse) => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );

      const xlmBalance = account.balances.find(
        (balance: BalanceResponse) => balance.asset_type === 'native'
      );

      return {
        publicKey,
        hasTrustline: !!usdcBalance,
        usdcBalance: usdcBalance?.balance || '0',
        xlmBalance: xlmBalance?.balance || '0',
        isActive: true
      };
    } catch {
      return {
        publicKey,
        hasTrustline: false,
        usdcBalance: '0',
        xlmBalance: '0',
        isActive: false
      };
    }
  }

  /**
   * Crear cuenta de usuario si no existe
   */
  async createUserAccount(publicKey: string): Promise<DepositResult> {
    try {
      // Verificar si la cuenta ya existe
      try {
        await server.loadAccount(publicKey);
        return {
          success: true,
          userAccount: publicKey,
          amount: '0'
        };
      } catch {
        // La cuenta no existe, crearla
      }

      // Crear cuenta con 2 XLM inicial
      const createAccountOperation = Operation.createAccount({
        destination: publicKey,
        startingBalance: '2', // 2 XLM: 1 para activar + 1 para fees
      });

      const adminAccount = await server.loadAccount(this.adminKeypair.publicKey());
      const transaction = new TransactionBuilder(adminAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(createAccountOperation)
        .setTimeout(30)
        .build();

      transaction.sign(this.adminKeypair);

      const result = await server.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash,
        userAccount: publicKey,
        amount: '2'
      };

    } catch {
      return {
        success: false,
        error: 'Error desconocido'
      };
    }
  }

  /**
   * Establecer trustline para USDC (debe ser llamado por el usuario)
   */
  async establishTrustline(userSecretKey: string): Promise<DepositResult> {
    try {
      const userKeypair = Keypair.fromSecret(userSecretKey);
      const userAccount = await server.loadAccount(userKeypair.publicKey());

      const changeTrustOperation = Operation.changeTrust({
        asset: this.usdcAsset,
        source: userKeypair.publicKey(),
      });

      const transaction = new TransactionBuilder(userAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(changeTrustOperation)
        .setTimeout(30)
        .build();

      transaction.sign(userKeypair);

      const result = await server.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash,
        userAccount: userKeypair.publicKey(),
        amount: '0'
      };

    } catch {
      return {
        success: false,
        error: 'Error desconocido'
      };
    }
  }

  /**
   * Procesar depósito de USDC
   */
  async processDeposit(depositRequest: DepositRequest): Promise<DepositResult> {
    try {
      // 1. Verificar que la cuenta admin tenga suficiente USDC
      const adminAccount = await server.loadAccount(this.adminKeypair.publicKey());
      const adminUsdcBalance = adminAccount.balances.find(
        (balance: BalanceResponse) => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );

      if (!adminUsdcBalance || parseFloat(adminUsdcBalance.balance) < depositRequest.amount) {
        return {
          success: false,
          error: 'Saldo insuficiente en la cuenta admin'
        };
      }

      // 2. Verificar que el usuario tenga trustline establecido
      const userInfo = await this.checkUserAccount(depositRequest.userPublicKey);
      if (!userInfo.isActive) {
        return {
          success: false,
          error: 'La cuenta de usuario no está activa'
        };
      }

      if (!userInfo.hasTrustline) {
        return {
          success: false,
          error: 'El usuario debe establecer trustline para USDC primero'
        };
      }

      // 3. Enviar USDC al usuario
      const paymentOperation = Operation.payment({
        source: this.adminKeypair.publicKey(),
        destination: depositRequest.userPublicKey,
        amount: depositRequest.amount.toString(),
        asset: this.usdcAsset,
      });

      const transaction = new TransactionBuilder(adminAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(paymentOperation)
        .setTimeout(30)
        .build();

      transaction.sign(this.adminKeypair);

      const result = await server.submitTransaction(transaction);
      
      return {
        success: true,
        transactionHash: result.hash,
        userAccount: depositRequest.userPublicKey,
        amount: depositRequest.amount.toString()
      };

    } catch {
      return {
        success: false,
        error: 'Error desconocido'
      };
    }
  }

  /**
   * Obtener historial de depósitos para una cuenta
   */
  async getDepositHistory(publicKey: string, limit: number = 20) {
    try {
      const payments = await server.payments()
        .forAccount(publicKey)
        .limit(limit)
        .call();

      return payments.records.filter((payment: unknown) => {
        const paymentRecord = payment as PaymentRecord;
        return paymentRecord.type === 'payment' &&
        paymentRecord.asset_type === 'credit_alphanum4' && 
        paymentRecord.asset_code === 'USDC' &&
        paymentRecord.from !== publicKey; // Solo depósitos recibidos, no enviados
      });
    } catch {
      return [];
    }
  }

  /**
   * Verificar balance de la cuenta admin
   */
  async getAdminBalance() {
    try {
      const adminAccount = await server.loadAccount(this.adminKeypair.publicKey());
      
      const usdcBalance = adminAccount.balances.find(
        (balance: BalanceResponse) => balance.asset_type === 'credit_alphanum4' && 
                   balance.asset_code === 'USDC'
      );

      const xlmBalance = adminAccount.balances.find(
        (balance: BalanceResponse) => balance.asset_type === 'native'
      );

      return {
        usdc: usdcBalance?.balance || '0',
        xlm: xlmBalance?.balance || '0'
      };
    } catch {
      return {
        usdc: '0',
        xlm: '0'
      };
    }
  }
}

// Instancia singleton del servicio
export const depositService = new DepositService(); 