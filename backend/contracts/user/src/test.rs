#![cfg(test)]
use crate::{User, UserClient};
use soroban_sdk::{
    testutils::Address as _,
    Address, Env,
};

fn setup_test<'a>(env: &Env, owner: Address) -> UserClient<'a> {
    env.mock_all_auths();
    let user_contract = env.register(User, (owner,));
    UserClient::new(&env, &user_contract)
}

#[test]
fn test_register_user() {
    let env = Env::default();
    let owner = Address::generate(&env);
    let client = setup_test(&env, owner);
    let user = Address::generate(&env);
    client.register_user(&user);
    assert!(client.is_user(&user));
}

#[test]
fn test_add_admin() {
    let env = Env::default();
    let owner = Address::generate(&env);
    let client = setup_test(&env, owner);
    let user = Address::generate(&env);
    client.register_user(&user);
    client.add_admin(&user);
    assert!(client.is_admin(&user));
}

#[test]
fn test_get_admins() {
    let env = Env::default();
    let owner = Address::generate(&env);
    let client = setup_test(&env, owner.clone());
    let user = Address::generate(&env);
    client.register_user(&user);
    client.add_admin(&user);
    let admins = client.get_admins();
    assert_eq!(admins.len(), 2);
    assert_eq!(admins.first().unwrap(), owner);
    assert_eq!(admins.last().unwrap(), user);
}

#[test]
fn test_is_admin() {
    let env = Env::default();
    let owner = Address::generate(&env);
    let client = setup_test(&env, owner.clone());
    let user = Address::generate(&env);
    assert!(client.is_admin(&owner));
    assert!(!client.is_admin(&user));
}

#[test]
fn test_is_user() {
    let env = Env::default();
    let owner = Address::generate(&env);
    let client = setup_test(&env, owner.clone());
    let user = Address::generate(&env);
    client.register_user(&user);
    assert!(client.is_user(&user));
    assert!(!client.is_user(&owner));
}
