#![cfg(test)]
extern crate std;

use crate::storage_types::AssetType;
use crate::{Gyro, GyroClient};
use soroban_sdk::{
    testutils::Address as _
    , Address, Env, String
};

fn setup_test<'a>(env: &Env) -> GyroClient<'a> {
    env.mock_all_auths();
    GyroClient::new(&env, &env.register(Gyro, ()))
}

#[test]
fn test_register_balance() {
    let env = Env::default();
    Address::generate(&env);
    let gyro_client = setup_test(&env);
    let user = Address::generate(&env);
    gyro_client.register_balance(&user);
    assert_eq!(gyro_client.get_user_balance(&user, &AssetType::USDC), 0);
}

#[test]
fn test_transfer() {
    let env = Env::default();
    Address::generate(&env);
    let gyro_client = setup_test(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    gyro_client.register_balance(&user1);
    gyro_client.register_balance(&user2);

    gyro_client.transfer(
        &gyro_client.address,
        &user1,
        &AssetType::USDC,
        &500,
        &String::from_str(&env, "2025-07-15"),
        &String::from_str(&env, "tx1"),
    );

    gyro_client.transfer(
        &user1,
        &user2,
        &AssetType::USDC,
        &500,
        &String::from_str(&env, "2025-07-15"),
        &String::from_str(&env, "tx2"),
    );

    assert_eq!(gyro_client.get_user_balance(&user1, &AssetType::USDC), 0);
    assert_eq!(gyro_client.get_user_balance(&user2, &AssetType::USDC), 500);
}

#[test]
fn test_withdraw() {
    let env = Env::default();
    Address::generate(&env);
    let gyro_client = setup_test(&env);
    let user = Address::generate(&env);
    Address::generate(&env);

    gyro_client.register_balance(&user);

    gyro_client.transfer(
        &gyro_client.address,
        &user,
        &AssetType::USDC,
        &1500,
        &String::from_str(&env, "2025-07-15"),
        &String::from_str(&env, "tx1"),
    );

    gyro_client.withdraw(
        &user,
        &AssetType::USDC,
        &500,
        &String::from_str(&env, "2025-07-15"),
        &String::from_str(&env, "tx456"),
    );

    assert_eq!(gyro_client.get_user_balance(&user, &AssetType::USDC), 1000);
}

#[test]
fn test_get_user_balance() {
    let env = Env::default();
    let gyro_client = setup_test(&env);
    let user = Address::generate(&env);
    gyro_client.register_balance(&user);
    assert_eq!(gyro_client.get_user_balance(&user, &AssetType::USDC), 0);
}

#[test]
fn test_get_tx_id() {
    let env = Env::default();
    let gyro_client = setup_test(&env);
    let user = Address::generate(&env);
    gyro_client.register_balance(&user);

    let date = String::from_str(&env, "2025-07-15");
    let tx_id = String::from_str(&env, "tx123");

    gyro_client.transfer(&gyro_client.address, &user, &AssetType::USDC, &500, &date, &tx_id);

    let tx = gyro_client.try_get_tx_id(&user, &tx_id).unwrap().unwrap();
    assert_eq!(tx.amount, 500);
    assert_eq!(tx.to, user);
}

#[test]
fn test_get_transactions() {
    let env = Env::default();
    let gyro_client = setup_test(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    gyro_client.register_balance(&user1);
    gyro_client.register_balance(&user2);

    gyro_client.transfer(
        &gyro_client.address, &user1, &AssetType::USDC, &1000,
        &String::from_str(&env, "2025-07-15"),
        &String::from_str(&env, "tx1")
    );

    gyro_client.transfer(
        &user1, &user2, &AssetType::USDC, &500,
        &String::from_str(&env, "2025-07-15"),
        &String::from_str(&env, "tx2")
    );

    let txs = gyro_client.get_transactions(&user1);
    assert_eq!(txs.len(), 2);
    assert_eq!(txs.get(0).unwrap().amount, 1000);
    assert_eq!(txs.get(1).unwrap().amount, 500);
}
