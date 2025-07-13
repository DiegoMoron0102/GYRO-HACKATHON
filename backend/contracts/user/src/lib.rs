#![no_std]
use crate::error::UserError;
use crate::storage_types::{DataKey, Role};
use soroban_sdk::{contract, contractimpl, vec, Address, Env, Vec};

#[contract]
pub struct User;

#[contractimpl]
impl User {
    pub fn __constructor(env: Env, owner: Address) {
        env.storage().instance().set(&Role::Owner, &owner);
        env.storage().persistent().set(&Role::Admins, &vec![&env, owner])
    }

    pub fn register_user(env: Env, user: Address) -> Result<(), UserError> {
        user.require_auth();
        let None: Option<Role> = env.storage().persistent().get(&DataKey::User(user.clone())) else {
            return Err(UserError::AlreadyRegistered);
        };

        env.storage().persistent().set(&DataKey::User(user), &Role::User);
        Ok(())
    }

    pub fn add_admin(env: Env, admin: Address) -> Result<(), UserError> {
        let Some(owner): Option<Address> = env.storage().instance().get(&Role::Owner) else {
            return Err(UserError::OwnerNotSet);
        };
        owner.require_auth();

        if Self::is_admin(&env, admin.clone()) {
            return Err(UserError::AlreadyAdmin);
        }

        if !Self::is_user(&env, admin.clone()) {
            return Err(UserError::NotAuthorized);
        }

        let mut admins: Vec<Address> = env.storage().persistent().get(&Role::Admins).unwrap_or(vec![&env]);
        admins.push_back(admin);
        env.storage().persistent().set(&Role::Admins, &admins);
        Ok(())
    }

    pub fn get_admins(env: Env) -> Vec<Address> {
        env.storage().persistent().get(&Role::Admins).unwrap_or(vec![&env])
    }

    pub fn is_admin(e: &Env, user: Address) -> bool {
        e.storage()
            .persistent()
            .get::<Role, Vec<Address>>(&Role::Admins)
            .map_or(false, |admins| admins.contains(&user))

    }

    pub fn is_user(e: &Env, user: Address) -> bool {
        e.storage()
            .persistent()
            .get::<DataKey, Role>(&DataKey::User(user))
            .map_or(false, |role| role == Role::User)
    }
}

mod test;
mod storage_types;
mod error;