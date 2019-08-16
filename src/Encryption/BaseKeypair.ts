import { DID } from "../DID/DID";


export abstract class BaseKeypair {
    protected publicKey : string;
    protected privateKey : string;

    constructor() {}

    abstract PublicEncrypt(message : string) : Promise<Buffer>;
    //These two functions dont seem useful as Sign and Verify should take care of this.
    //abstract PublicDecrypt(input: string) : Promise<string>;
    //abstract PrivateEncrypt(message: string) : Promise<Buffer>;
    abstract PrivateDecrypt(input: Buffer) : Promise<string>;
    abstract Sign(dataToSign : string) : Buffer;
    abstract Verify(dataToCheck : string, signatureToVerify : Buffer) : boolean;
    abstract GetKeyType() : string;

    public GetPublicKey(): string {
        return this.publicKey;
    }
    public GetPrivateKey(): string {
        return this.privateKey;
    }
}