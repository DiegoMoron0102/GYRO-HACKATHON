use soroban_sdk::{Address, Env};
use crate::error::{TransactionError};
use crate::storage_types::{AssetType, DataKey};

pub fn get_balance(env: &Env, user: Address, asset_type: AssetType) -> Result<u32, TransactionError> {
    match env.storage().persistent().get::<DataKey, u32>(&DataKey::Registered(user.clone(), asset_type.clone())) {
        Some(balance) => Ok(balance),
        None => Err(TransactionError::BalanceDoesNotExist),
    }
}

pub fn set_balance(env: &Env, user: Address, asset_type: AssetType, amount: u32) -> () {
    env.storage().persistent().set(&DataKey::Registered(user.clone(), asset_type), &amount);
}
