import { PublicKey } from '@decentralized-identity/did-auth-jose';
import IIdentifier from './IIdentifier';
import IIdentifierDocument from './IIdentifierDocument';
import IResolver from './IResolver';

/**
 * Mock implementation of a IResolver which will return the configured DID documents.
 */
export default class MockResolver implements IResolver {

  private keys: {[did: string]: PublicKey} = {};

  constructor(keys?: {[did: string]: PublicKey}) {
    if (keys) {
      Object.keys(keys).forEach(did => this.keys[did] = keys[did]);
    }
  }

  /**
   * Sets the key for a specific DID.
   */
  setKey(did: string, key: PublicKey) {
    this.keys[did] = key;
  }
  
  /**
   * Resolves the given DID.
   */
  async resolve(did: IIdentifier): Promise<IIdentifierDocument> {

    const key = this.keys[did.id];

    if (!key) {
      throw new Error(`MockResolver has no entry for requested DID: ${did.id}`);
    }

    return new Promise((resolvePromise) => { 
      const identifierDocument: any = {
        id: did.id,
        publicKey: [{
          id: key.kid,
          type: 'RsaVerificationKey2018',
          controller: did,
          publicKeyJwk: key
        }]
      };

      return resolvePromise(identifierDocument as IIdentifierDocument);
    });
  }
}
