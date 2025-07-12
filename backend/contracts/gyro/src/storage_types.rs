use soroban_sdk::{contracttype, Address, Symbol};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Paused(bool),
    Balance(Address, AssetType),
    UsedTx(Symbol),
    RecentTxs(Address)
}

#[contracttype]
#[derive(Clone)]
pub enum AssetType {
    Bs,
    USDC
}