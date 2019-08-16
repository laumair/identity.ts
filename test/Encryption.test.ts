import { expect } from 'chai';
import 'mocha';
import { GenerateRSAKeypair } from '../src/Helpers/GenerateKeypair';
import { RSAKeypair, passphrase } from '../src/Encryption/RSAKeypair';
import { RecursiveSort } from '../src/Helpers/RecursiveSort';
import * as crypto from 'crypto';


describe('RSA Encryption', function() {
    let keypair : RSAKeypair;
    let msg : string = "Hello World";

    it('Should generate a keypair', async function() {
        keypair = await GenerateRSAKeypair();
        expect(keypair).to.not.be.undefined;
    });

    it('Should encrypt->decrypt to reveal the same message', async function() {
        let encryptedMsg : Buffer = await keypair.PublicEncrypt(msg);
        expect(await keypair.PrivateDecrypt(encryptedMsg)).to.deep.equal(msg);
    });

    it('Should Sign and correctly verify msg', async function() {
        let signature : Buffer = await keypair.Sign(msg);
        console.log(keypair.Verify(msg, signature));
        expect(await keypair.Verify(msg, signature)).to.be.true;
    });

    it('Should Sign and catch the change', async function() {
        let signature : Buffer = await keypair.Sign(msg);
        expect(await keypair.Verify("Another message", signature)).to.be.false;
    });    
});

describe('Recursive Sorting', function() {
    let SortedObject = [{
        "id": [{
            "did" : "did",
        }, {
            "method" : "example",
            "uuid" : "ebfeb1f712ebc6f1c276e12ec21"
        }],
        "name":  {
            "firstname" : "Jayden",
            "surname" : "Doe"
        },
        "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
    }, {
        "id": [{
            "did" : "did",
        }, {
            "method" : "example",
            "uuid" : "c276e12ec21ebfeb1f712ebc6f1"
        }],
        "name": {
            "firstname" : "Morgan",
            "surname" : "Doe"
        },
        "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21"
    }];

    let UnsortedObject = [{
        "id": [{
            "did" : "did",
        }, {
            "uuid" : "ebfeb1f712ebc6f1c276e12ec21",
            "method" : "example"
        }],
        "name":  {
            "surname" : "Doe",
            "firstname" : "Jayden"
        },
        "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
    }, {
        "name": {
            "firstname" : "Morgan",
            "surname" : "Doe"
        },
        "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "id": [{
            "did" : "did",
        }, {
            "method" : "example",
            "uuid" : "c276e12ec21ebfeb1f712ebc6f1"
        }]       
    }];
    //console.log(UnsortedObject);
    //console.log(Object.assign({},UnsortedObject));
    let PostSorting = RecursiveSort(UnsortedObject);
    let keypair : RSAKeypair;
    
    before( async function(){ 
        keypair = await GenerateRSAKeypair();
    }); 

    it('Should sort the document correctly', function() {
        console.log(SortedObject);
        console.log(PostSorting);
        expect(SortedObject).to.deep.equal(PostSorting);
    });

    it('Should not match signatures when scrambled', function() {
        expect(keypair.Sign(JSON.stringify(SortedObject))).to.not.deep.equal(keypair.Sign(JSON.stringify(UnsortedObject)));
    });

    it('Should match signatures even when first scrambled and then sorted', function() {
        expect(keypair.Sign(JSON.stringify(SortedObject))).to.deep.equal(keypair.Sign(JSON.stringify(PostSorting)));
    });    
});