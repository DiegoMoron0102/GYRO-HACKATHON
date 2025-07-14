use soroban_sdk::contracterror;

#[derive(Clone)]
#[contracterror]
#[derive(Debug)]
pub enum TransactionError {
    DuplicateTx = 1,
    InsufficientBalance = 2,
    BalanceDoesNotExist = 3,
    ContractPaused = 4,
    InsufficientLiquidityFund = 5,
    TransactionNotFound = 6,
    TransactionIsEmpty = 7,
}