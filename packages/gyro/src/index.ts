import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCUBPUO2BOPXMMHOJURTQDLQNZMBP3CTDUYMP2H4O3SMRJB5L2EY2RSO",
  }
} as const

export type DataKey = {tag: "Balance", values: readonly [string, AssetType]} | {tag: "Transactions", values: readonly [string]};

export type AssetType = {tag: "Bs", values: void} | {tag: "USDC", values: void};

export type TransactionType = {tag: "Deposit", values: void} | {tag: "Transfer", values: void};


export interface Transaction {
  amount: u32;
  asset_type: AssetType;
  date: string;
  from: string;
  to: string;
  transaction_type: TransactionType;
  tx_id: string;
}

export const TransactionError = {
  1: {message:"DuplicateTx"},
  2: {message:"InsufficientBalance"},
  3: {message:"BalanceDoesNotExist"},
  4: {message:"ContractPaused"},
  5: {message:"InsufficientLiquidityFund"},
  6: {message:"TransactionNotFound"},
  7: {message:"TransactionIsEmpty"}
}

export interface Client {
  /**
   * Construct and simulate a register_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register_balance: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({from, to, asset_type, amount, date, tx_id}: {from: string, to: string, asset_type: AssetType, amount: u32, date: string, tx_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({user, asset_type, amount, date, tx_id}: {user: string, asset_type: AssetType, amount: u32, date: string, tx_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_user_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_user_balance: ({user, asset_type}: {user: string, asset_type: AssetType}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<u32>>>

  /**
   * Construct and simulate a get_tx_id transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_tx_id: ({user, tx_id}: {user: string, tx_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Transaction>>>

  /**
   * Construct and simulate a get_transactions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_transactions: ({user}: {user: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Transaction>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {owner}: {owner: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({owner}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAQcmVnaXN0ZXJfYmFsYW5jZQAAAAEAAAAAAAAABHVzZXIAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAAGAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAACmFzc2V0X3R5cGUAAAAAB9AAAAAJQXNzZXRUeXBlAAAAAAAAAAAAAAZhbW91bnQAAAAAAAQAAAAAAAAABGRhdGUAAAAQAAAAAAAAAAV0eF9pZAAAAAAAABAAAAABAAAD6QAAA+0AAAAAAAAH0AAAABBUcmFuc2FjdGlvbkVycm9y",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAFAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAKYXNzZXRfdHlwZQAAAAAH0AAAAAlBc3NldFR5cGUAAAAAAAAAAAAABmFtb3VudAAAAAAABAAAAAAAAAAEZGF0ZQAAABAAAAAAAAAABXR4X2lkAAAAAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAEFRyYW5zYWN0aW9uRXJyb3I=",
        "AAAAAAAAAAAAAAAQZ2V0X3VzZXJfYmFsYW5jZQAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAAphc3NldF90eXBlAAAAAAfQAAAACUFzc2V0VHlwZQAAAAAAAAEAAAPpAAAABAAAB9AAAAAQVHJhbnNhY3Rpb25FcnJvcg==",
        "AAAAAAAAAAAAAAAJZ2V0X3R4X2lkAAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABXR4X2lkAAAAAAAAEAAAAAEAAAPpAAAH0AAAAAtUcmFuc2FjdGlvbgAAAAfQAAAAEFRyYW5zYWN0aW9uRXJyb3I=",
        "AAAAAAAAAAAAAAAQZ2V0X3RyYW5zYWN0aW9ucwAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAA+oAAAfQAAAAC1RyYW5zYWN0aW9uAA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAgAAABMAAAfQAAAACUFzc2V0VHlwZQAAAAAAAAEAAAAAAAAADFRyYW5zYWN0aW9ucwAAAAEAAAAT",
        "AAAAAgAAAAAAAAAAAAAACUFzc2V0VHlwZQAAAAAAAAIAAAAAAAAAAAAAAAJCcwAAAAAAAAAAAAAAAAAEVVNEQw==",
        "AAAAAgAAAAAAAAAAAAAAD1RyYW5zYWN0aW9uVHlwZQAAAAACAAAAAAAAAAAAAAAHRGVwb3NpdAAAAAAAAAAAAAAAAAhUcmFuc2Zlcg==",
        "AAAAAQAAAAAAAAAAAAAAC1RyYW5zYWN0aW9uAAAAAAcAAAAAAAAABmFtb3VudAAAAAAABAAAAAAAAAAKYXNzZXRfdHlwZQAAAAAH0AAAAAlBc3NldFR5cGUAAAAAAAAAAAAABGRhdGUAAAAQAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAEHRyYW5zYWN0aW9uX3R5cGUAAAfQAAAAD1RyYW5zYWN0aW9uVHlwZQAAAAAAAAAABXR4X2lkAAAAAAAAEA==",
        "AAAABAAAAAAAAAAAAAAAEFRyYW5zYWN0aW9uRXJyb3IAAAAHAAAAAAAAAAtEdXBsaWNhdGVUeAAAAAABAAAAAAAAABNJbnN1ZmZpY2llbnRCYWxhbmNlAAAAAAIAAAAAAAAAE0JhbGFuY2VEb2VzTm90RXhpc3QAAAAAAwAAAAAAAAAOQ29udHJhY3RQYXVzZWQAAAAAAAQAAAAAAAAAGUluc3VmZmljaWVudExpcXVpZGl0eUZ1bmQAAAAAAAAFAAAAAAAAABNUcmFuc2FjdGlvbk5vdEZvdW5kAAAAAAYAAAAAAAAAElRyYW5zYWN0aW9uSXNFbXB0eQAAAAAABw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    register_balance: this.txFromJSON<null>,
        transfer: this.txFromJSON<Result<void>>,
        withdraw: this.txFromJSON<Result<void>>,
        get_user_balance: this.txFromJSON<Result<u32>>,
        get_tx_id: this.txFromJSON<Result<Transaction>>,
        get_transactions: this.txFromJSON<Array<Transaction>>
  }
}