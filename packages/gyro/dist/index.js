import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CAL2BH5KK5XTI6PN5Q7LNBXW5WAFGGNKD2XVE5G6FKOYON4IYOQQC6IN",
    }
};
export const TransactionError = {
    1: { message: "DuplicateTx" },
    2: { message: "InsufficientBalance" },
    3: { message: "BalanceDoesNotExist" },
    4: { message: "ContractPaused" },
    5: { message: "InsufficientLiquidityFund" },
    6: { message: "TransactionNotFound" },
    7: { message: "TransactionIsEmpty" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { user_contract_id, usdc_token }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ user_contract_id, usdc_token }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAIAAAAAAAAAEHVzZXJfY29udHJhY3RfaWQAAAATAAAAAAAAAAp1c2RjX3Rva2VuAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAQcmVnaXN0ZXJfYmFsYW5jZQAAAAEAAAAAAAAABHVzZXIAAAATAAAAAA==",
            "AAAAAAAAAAAAAAANYWRtaW5fYXBwcm92ZQAAAAAAAAIAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAJVXNlckVycm9yAAAA",
            "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAAGAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAACmFzc2V0X3R5cGUAAAAAB9AAAAAJQXNzZXRUeXBlAAAAAAAAAAAAAAZhbW91bnQAAAAAAAQAAAAAAAAABGRhdGUAAAAQAAAAAAAAAAV0eF9pZAAAAAAAABAAAAABAAAD6QAAA+0AAAAAAAAH0AAAABBUcmFuc2FjdGlvbkVycm9y",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAAFAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAKYXNzZXRfdHlwZQAAAAAH0AAAAAlBc3NldFR5cGUAAAAAAAAAAAAABmFtb3VudAAAAAAABAAAAAAAAAAEZGF0ZQAAABAAAAAAAAAABXR4X2lkAAAAAAAAEAAAAAEAAAPpAAAD7QAAAAAAAAfQAAAAEFRyYW5zYWN0aW9uRXJyb3I=",
            "AAAAAAAAAAAAAAAQZ2V0X3VzZXJfYmFsYW5jZQAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAAphc3NldF90eXBlAAAAAAfQAAAACUFzc2V0VHlwZQAAAAAAAAEAAAPpAAAABAAAB9AAAAAQVHJhbnNhY3Rpb25FcnJvcg==",
            "AAAAAAAAAAAAAAAJZ2V0X3R4X2lkAAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABXR4X2lkAAAAAAAAEAAAAAEAAAPpAAAH0AAAAAtUcmFuc2FjdGlvbgAAAAfQAAAAEFRyYW5zYWN0aW9uRXJyb3I=",
            "AAAAAAAAAAAAAAAQZ2V0X3RyYW5zYWN0aW9ucwAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAA+oAAAfQAAAAC1RyYW5zYWN0aW9uAA==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAgAAABMAAAfQAAAACUFzc2V0VHlwZQAAAAAAAAEAAAAAAAAADFRyYW5zYWN0aW9ucwAAAAEAAAAT",
            "AAAAAgAAAAAAAAAAAAAACUFzc2V0VHlwZQAAAAAAAAIAAAAAAAAAAAAAAAJCcwAAAAAAAAAAAAAAAAAEVVNEQw==",
            "AAAAAgAAAAAAAAAAAAAAD1RyYW5zYWN0aW9uVHlwZQAAAAACAAAAAAAAAAAAAAAHRGVwb3NpdAAAAAAAAAAAAAAAAAhUcmFuc2Zlcg==",
            "AAAAAQAAAAAAAAAAAAAAC1RyYW5zYWN0aW9uAAAAAAcAAAAAAAAABmFtb3VudAAAAAAABAAAAAAAAAAKYXNzZXRfdHlwZQAAAAAH0AAAAAlBc3NldFR5cGUAAAAAAAAAAAAABGRhdGUAAAAQAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAAEHRyYW5zYWN0aW9uX3R5cGUAAAfQAAAAD1RyYW5zYWN0aW9uVHlwZQAAAAAAAAAABXR4X2lkAAAAAAAAEA==",
            "AAAABAAAAAAAAAAAAAAAEFRyYW5zYWN0aW9uRXJyb3IAAAAHAAAAAAAAAAtEdXBsaWNhdGVUeAAAAAABAAAAAAAAABNJbnN1ZmZpY2llbnRCYWxhbmNlAAAAAAIAAAAAAAAAE0JhbGFuY2VEb2VzTm90RXhpc3QAAAAAAwAAAAAAAAAOQ29udHJhY3RQYXVzZWQAAAAAAAQAAAAAAAAAGUluc3VmZmljaWVudExpcXVpZGl0eUZ1bmQAAAAAAAAFAAAAAAAAABNUcmFuc2FjdGlvbk5vdEZvdW5kAAAAAAYAAAAAAAAAElRyYW5zYWN0aW9uSXNFbXB0eQAAAAAABw=="]), options);
        this.options = options;
    }
    fromJSON = {
        register_balance: (this.txFromJSON),
        admin_approve: (this.txFromJSON),
        transfer: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        get_user_balance: (this.txFromJSON),
        get_tx_id: (this.txFromJSON),
        get_transactions: (this.txFromJSON)
    };
}
