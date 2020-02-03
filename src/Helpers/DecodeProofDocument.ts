import { ExtendedProofDocument, ProofParameters } from "../VC/Proof/Proof";
import { DIDDocument } from "../DID/DIDDocument";
import { DID } from "../DID/DID";

export async function DecodeProofDocument(proofDocument: ExtendedProofDocument, provider: string): Promise<ProofParameters> {
    return DIDDocument.readDIDDocument(provider, new DID(proofDocument.creator).GetUUID())
        .then((issuerDID) => {
            return {
                'issuer': issuerDID,
                'issuerKeyId': new DID(proofDocument.verificationMethod).GetFragment(),
                'challengeNonce': proofDocument.nonce
            };
        });
}
