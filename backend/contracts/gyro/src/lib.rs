#![no_std]
use crate::error::TransactionError;
use crate::storage_types::AssetType;
use crate::storage_types::DataKey::{Balance, Transactions};
use crate::storage_types::{Transaction, TransactionType};
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Address, Env, String, Symbol, Vec};

const TRANSFER: Symbol = symbol_short!("TRANSFER");
const WITHDRAW: Symbol = symbol_short!("WITHDRAW");

#[contract]
pub struct Gyro;

#[contractimpl]
impl Gyro {
    pub fn __constructor(env: Env,  owner: Address) {
        env.storage().instance().set(&"owner", &owner);
        env.storage().persistent().set(&Balance(env.current_contract_address(), AssetType::USDC), &1000000u32);
    }
    pub fn register_balance(env: Env, user: Address) {
        env.storage().persistent().set(&Balance(user, AssetType::USDC), &0u32);
    }

    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        asset_type: AssetType,
        amount: u32,
        date: String,
        tx_id: String,
    ) -> Result<(), TransactionError> {
        from.require_auth();
        let mut from_balance: u32 = Self::get_user_balance(env.clone(), from.clone(), asset_type.clone())?;
        if amount <= 0 || from_balance < amount {
            return Err(TransactionError::InsufficientBalance);
        }

        let mut to_balance: u32 = Self::get_user_balance(env.clone(), to.clone(), asset_type.clone())?;
        to_balance += amount;
        from_balance -= amount;
        env.storage().persistent().set(&Balance(to.clone(), asset_type.clone()), &to_balance);
        env.storage().persistent().set(&Balance(from.clone(), asset_type.clone()), &from_balance);
        let mut transaction = Transaction {
            amount,
            date,
            tx_id,
            to: to.clone(),
            from: from.clone(),
            transaction_type: TransactionType::Transfer,
            asset_type: asset_type.clone(),
        };
        Self::save_transaction(env.clone(), to.clone(), transaction.clone())?;
        transaction.transaction_type = TransactionType::Deposit;
        Self::save_transaction(env.clone(), from.clone(), transaction)?;
        env.events().publish((TRANSFER, &to, asset_type.clone()), to_balance);
        env.events().publish((TRANSFER, &from, asset_type), from_balance);
        Ok(())
    }

    pub fn withdraw(
        env: Env,
        user: Address,
        asset_type: AssetType,
        amount: u32,
        date: String,
        tx_id: String,
    ) -> Result<(), TransactionError> {
        user.require_auth();
        let mut user_balance: u32 = Self::get_user_balance(env.clone(), user.clone(), asset_type.clone())?;
        if amount <= 0 || user_balance < amount {
            return Err(TransactionError::InsufficientBalance);
        }
        user_balance -= amount;
        env.storage().persistent().set(&Balance(user.clone(), asset_type.clone()), &user_balance);
        let transaction = Transaction {
            amount,
            date,
            tx_id,
            to: user.clone(),
            from: env.current_contract_address(),
            transaction_type: TransactionType::Deposit,
            asset_type: asset_type.clone(),
        };
        Self::save_transaction(env.clone(), user.clone(), transaction)?;
        env.events().publish((WITHDRAW, &user, asset_type), amount);
        Ok(())
    }

    fn save_transaction(
        env: Env,
        user: Address,
        transaction: Transaction,
    ) -> Result<(), TransactionError> {
        let tx_id = transaction.tx_id.clone();
        let mut tx_list: Vec<Transaction> = env.storage().persistent().get(&Transactions(user.clone())).unwrap_or(vec![&env]);

        for existing_tx in tx_list.iter() {
            if existing_tx.tx_id == tx_id {
                return Err(TransactionError::DuplicateTx);
            }
        }
        tx_list.push_back(transaction.clone());
        env.storage().persistent().set(&Transactions(user), &tx_list);
        Ok(())
    }

    pub fn get_user_balance(env: Env, user: Address, asset_type: AssetType) -> Result<u32, TransactionError> {
        let Some(balance) = env.storage().persistent().get(&Balance(user, asset_type)) else {
            return Err(TransactionError::BalanceDoesNotExist);
        };
        Ok(balance)
    }

    pub fn get_tx_id(env: Env, user: Address, tx_id: String) -> Result<Transaction, TransactionError> {
        let Some(tx_list): Option<Vec<Transaction>> = env.storage().persistent().get(&Transactions(user)) else {
            return Err(TransactionError::TransactionIsEmpty);
        };
        tx_list.iter().find(|tx|
            tx.tx_id == tx_id
        ).ok_or(TransactionError::TransactionNotFound)
    }

    pub fn get_transactions(env: Env, user: Address) -> Vec<Transaction> {
        env.storage().persistent().get(&Transactions(user)).unwrap_or(vec![&env])
    }
}

mod test;
mod storage_types;
mod error;