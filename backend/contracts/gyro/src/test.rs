#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _}, Env};

extern crate std;

#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();
    let owner = Address::generate(&env);
    let contract_user_id = env.register(user_contract::WASM, (owner,));
    let client_user = user_contract::Client::new(&env, &contract_user_id);
    let client = GyroClient::new(&env, &env.register(Gyro{}, (contract_user_id, Address::from_str(&env, "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"))));

    let user1 = Address::generate(&env);
    client_user.register_user(&user1);
    client_user.add_admin(&user1);
    client.admin_approve(&user1, &1000);
}