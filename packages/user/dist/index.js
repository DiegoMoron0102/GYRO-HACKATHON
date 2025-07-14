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
        contractId: "CANM3T4BWINEPXWFWDIUT7XFX44TGS6AFJMXPNGKFSW6J7UL2422M263",
    }
};
export const UserError = {
    1: { message: "NotAuthorized" },
    2: { message: "AlreadyRegistered" },
    3: { message: "NotRegistered" },
    4: { message: "OwnerNotSet" },
    5: { message: "AlreadyAdmin" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { owner }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ owner }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAANcmVnaXN0ZXJfdXNlcgAAAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAJVXNlckVycm9yAAAA",
            "AAAAAAAAAAAAAAAJYWRkX2FkbWluAAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAJVXNlckVycm9yAAAA",
            "AAAAAAAAAAAAAAAKZ2V0X2FkbWlucwAAAAAAAAAAAAEAAAPqAAAAEw==",
            "AAAAAAAAAAAAAAAIaXNfYWRtaW4AAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAB",
            "AAAAAAAAAAAAAAAHaXNfdXNlcgAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAB",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAABFVzZXIAAAABAAAAEw==",
            "AAAAAgAAAAAAAAAAAAAABFJvbGUAAAADAAAAAAAAAAAAAAAFT3duZXIAAAAAAAAAAAAAAAAAAAZBZG1pbnMAAAAAAAAAAAAAAAAABFVzZXI=",
            "AAAABAAAAAAAAAAAAAAACVVzZXJFcnJvcgAAAAAAAAUAAAAAAAAADU5vdEF1dGhvcml6ZWQAAAAAAAABAAAAAAAAABFBbHJlYWR5UmVnaXN0ZXJlZAAAAAAAAAIAAAAAAAAADU5vdFJlZ2lzdGVyZWQAAAAAAAADAAAAAAAAAAtPd25lck5vdFNldAAAAAAEAAAAAAAAAAxBbHJlYWR5QWRtaW4AAAAF"]), options);
        this.options = options;
    }
    fromJSON = {
        register_user: (this.txFromJSON),
        add_admin: (this.txFromJSON),
        get_admins: (this.txFromJSON),
        is_admin: (this.txFromJSON),
        is_user: (this.txFromJSON)
    };
}
