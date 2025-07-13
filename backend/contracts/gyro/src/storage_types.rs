use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Balance(Address, AssetType),
    Transactions(Address),
}

#[contracttype]
#[derive(Clone)]
pub enum AssetType {
    Bs,
    USDC
}

#[contracttype]
#[derive(Clone)]
pub enum TransactionType {
    Deposit,
    Transfer
}

#[contracttype]
#[derive(Clone)]
pub struct  Transaction {
    pub amount: u32,
    pub date: String,
    pub tx_id: String,
    pub to: Address,
    pub from: Address,
    pub transaction_type: TransactionType,
    pub asset_type: AssetType
}