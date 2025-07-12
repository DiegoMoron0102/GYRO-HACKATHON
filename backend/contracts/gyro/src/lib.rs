#![no_std]
extern crate alloc;

use crate::error::{TransactionError, UserError};
use crate::storage_types::{AssetType, DataKey};
use crate::user::{get_balance, set_balance};
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

const CONTRACT_NAME: &str = "MoneyApp";
const CONTRACT_VERSION: &str = "0.1.0";
const TRANSFER: Symbol = symbol_short!("TRANSFER");

#[contract]
pub struct Gyro;

#[contractimpl]
impl Gyro {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn register(env: Env, user: Address) -> Result<(), UserError> {
        user.require_auth();
        let Some(_): Option<AssetType> = env.storage().persistent().get(&DataKey::Registered(user.clone(), AssetType::USDC)) else {
            return Err(UserError::NotRegistered);
        };
        env.storage().persistent().set(&DataKey::Registered(user.clone(), AssetType::USDC), &0);
        Ok(())
    }

    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        asset_type: AssetType,
        amount: u32,
    ) -> Result<(), TransactionError> {
        from.require_auth();
        let mut from_balance: u32 = get_balance(&env, from.clone(), asset_type.clone())?;
        if amount <= 0 || from_balance < amount {
            return Err(TransactionError::InsufficientBalance);
        }

        let mut to_balance: u32 = get_balance(&env, to.clone(), asset_type.clone())?;
        to_balance += amount;
        from_balance -= amount;
        set_balance(&env, from, asset_type.clone(), from_balance);
        set_balance(&env, to.clone(), asset_type.clone(), to_balance);

        env.events().publish((TRANSFER, &to, asset_type), amount);
        Ok(())
    }

    pub fn withdraw(
        env: Env,
        user: Address,
        asset_type: AssetType,
        amount: u32
    ) -> Result<(), TransactionError> {
        Ok(())
    }

}

mod test;
mod admin;
mod storage_types;
mod user;
mod error;