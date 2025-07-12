use soroban_sdk::contracterror;

#[derive(Clone)]
#[contracterror]
pub enum UserError {
    NotAuthorized = 1,
    AlreadyRegistered = 2,
    NotRegistered = 3
}

#[derive(Clone)]
#[contracterror]
pub enum TransactionError {
    DuplicateTx = 1,
    InsufficientBalance = 2,
    BalanceDoesNotExist = 3,
    ContractPaused = 4,
}