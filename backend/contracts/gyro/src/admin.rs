use soroban_sdk::{Address, Env};

use crate::storage_types::DataKey;

pub fn read_administrator(e: &Env) -> Address {
    let key = DataKey::Admin;
    e.storage().instance().get(&key).unwrap()
}

pub fn is_administrator(e: &Env, user: Address) -> bool {
    let admin: Address = e.storage().instance().get(&DataKey::Admin).unwrap();
    user == admin
}
