#![no_std]
use crate::error::TransactionError;
use crate::storage_types::DataKey;
use user_contract::UserError;
use crate::storage_types::AssetType;
use soroban_sdk::{contract, contractimpl, symbol_short, token, Address, Env, Symbol, Vec};
use crate::storage_types::DataKey::Balance;

const TRANSFER: Symbol = symbol_short!("TRANSFER");
const WITHDRAW: Symbol = symbol_short!("WITHDRAW");
const USER_CONTRACT: Symbol = symbol_short!("USER_C");
const USDC_ASSET: Symbol = symbol_short!("USDC_ID");

mod user_contract {
    soroban_sdk::contractimport!(
        file = "../../../target/wasm32v1-none/release/user.wasm",
    );
}

#[contract]
pub struct Gyro;

#[contractimpl]
impl Gyro {
    pub fn __constructor(env: Env, user_contract_id: Address, usdc_token: Address) {
        env.storage().instance().set(&USER_CONTRACT, &user_contract_id);
        env.storage().instance().set(&USDC_ASSET, &usdc_token);
    }
    pub fn register_balance(env: Env, user: Address) {
        env.storage().persistent().set(&Balance(user, AssetType::USDC), &0u32);
    }

    pub fn admin_approve(env: Env, admin: Address, amount: i128) -> Result<(), UserError> {
        admin.require_auth();
        let user_contract_id: Address = env.storage().instance().get(&USER_CONTRACT).unwrap();
        let client = user_contract::Client::new(&env, &user_contract_id);
        if !client.is_admin(&admin) {
            return Err(UserError::NotAuthorized);
        };

        let usdc_token: Address = env.storage().instance().get(&USDC_ASSET).unwrap();
        token::Client::new(&env, &usdc_token).approve(
            &admin,
            &env.current_contract_address(),
            &amount,
            &((env.ledger().timestamp() + 30 * 24 * 60 * 60) as u32) // 30-day expiration
        );
        Ok(())
    }
    // pub fn transfer(
    //     env: Env,
    //     from: Address,
    //     to: Address,
    //     asset_type: AssetType,
    //     amount: u32,
    // ) -> Result<(), TransactionError> {
    //     from.require_auth();
    //     let mut from_balance: u32 = get_balance(&env, from.clone(), asset_type.clone())?;
    //     if amount <= 0 || from_balance < amount {
    //         return Err(TransactionError::InsufficientBalance);
    //     }
    //
    //     let mut to_balance: u32 = get_balance(&env, to.clone(), asset_type.clone())?;
    //     to_balance += amount;
    //     from_balance -= amount;
    //     set_balance(&env, from, asset_type.clone(), from_balance);
    //     set_balance(&env, to.clone(), asset_type.clone(), to_balance);
    //
    //     env.events().publish((TRANSFER, &to, asset_type), amount);
    //     Ok(())
    // }
    //
    pub fn withdraw(
        env: Env,
        user: Address,
        asset_type: AssetType,
        amount: u32
    ) -> Result<(), TransactionError> {
        user.require_auth();
        let mut user_balance: u32 = Self::get_user_balance(env, user.clone(), asset_type.clone())?;
        match asset_type {
            AssetType::USDC => {
                if amount <= 0 || user_balance < amount {
                    return Err(TransactionError::InsufficientBalance);
                }

                user_balance -= amount;
            },
            AssetType::Bs => {
                return Err(TransactionError::InsufficientBalance);
            },
        }
        Ok(())
    }

    fn find_available_admin(env: &Env, token: &token::Client, amount: i128) -> Option<Address> {
        let client = user_contract::Client::new(env, &env.storage().instance().get(&USER_CONTRACT).unwrap());
        let admins: Vec<Address> = client.get_admins();

        for admin in admins.iter() {
            let allowance = token.allowance(&admin, &env.current_contract_address());
            if allowance >= amount {
                return Some(admin.clone());
            }
        }
        None
    }
    //
    // pub fn transfer(
    //     env: Env,
    //     from: Address,
    //     to: Address,
    //     asset: Address,
    //     amount: i128,
    // ) -> Result<(), Error>;
    //
    pub fn get_user_balance(env: Env, user: Address, asset_type: AssetType) -> Result<u32, TransactionError> {
        let Some(balance) = env.storage().persistent().get(&Balance(user, asset_type)) else {
            return Err(TransactionError::BalanceDoesNotExist);
        };
        Ok(balance)
    }
    // pub fn get_contract_balance(env: Env, asset: Address) -> i128;
    // pub fn get_recent_txids(env: Env, user: Address) -> Vec<Symbol>;
    //
    // pub fn set_paused(env: Env, admin: Address, paused: bool) -> Result<(), Error>;
    //
    // pub fn supply_to_pool(
    //     env: Env,
    //     user: Address,
    //     asset: Address,
    //     pool_id: Address,
    //     amount: i128,
    // ) -> Result<(), Error>;
}

mod test;
mod storage_types;
mod error;