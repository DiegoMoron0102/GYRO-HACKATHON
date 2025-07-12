use soroban_sdk::contracterror;

#[derive(Clone)]
#[contracterror]
pub enum UserError {
    NotAuthorized = 1,
    AlreadyRegistered = 2,
    NotRegistered = 3,
    OwnerNotSet = 4,
    AlreadyAdmin = 5,
}