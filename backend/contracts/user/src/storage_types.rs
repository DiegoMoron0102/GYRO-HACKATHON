use soroban_sdk::{contracttype, Address};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    User(Address)
}

#[contracttype]
#[derive(Eq, PartialEq)]
pub enum Role {
    Owner,
    Admins,
    User
}