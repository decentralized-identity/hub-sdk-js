import { PrivateKey, PublicKey } from '@decentralized-identity/did-auth-jose';
import IKeyStore from './IKeyStore';
import { ProtectionFormat } from '../../src/crypto/ProtectionFormat';
import Protect from '../../src/crypto/Protect';

/**
 * Class defining methods and properties to mock a KeyStore
 */
export default class KeyStoreMock implements IKeyStore {
  private store: Map<string, Buffer | PrivateKey | PublicKey> = new Map<string, Buffer | PrivateKey | PublicKey>();

  /**
   * Returns the key associated with the specified
   * key identifier.
   * @param keyReference for which to return the key.
   * @param publicKeyOnly True if only the public key is needed.
   */
  get (keyReference: string, _publicKeyOnly: boolean): Promise<Buffer | PrivateKey | PublicKey>{
    return new Promise((resolve, reject) => {
      if (this.store.has(keyReference)) {
        resolve(this.store.get(keyReference));
      } else {
        reject(`${keyReference} not found`);
      }
    });
  }

  /**
   * Saves the specified key to the key store using
   * the key identifier.
   * @param keyIdentifier for the key being saved.
   * @param key being saved to the key store.
   */
  save (keyIdentifier: string, key: Buffer | PrivateKey | PublicKey): Promise<void> {
    console.log(this.store.toString() + keyIdentifier + key.toString());
    this.store.set(keyIdentifier, key);
    return new Promise((resolve) => {
      resolve();
    });
  }

  /**
   * Sign the data with the key referenced by keyIdentifier.
   * @param keyIdentifier for the key used for signature.
   * @param data Data to sign
   * @param format Signature format
   */
  public async protect (keyIdentifier: string, data: string, _format: ProtectionFormat): Promise<string> {
    return Protect.sign(data, keyIdentifier, this);
  }
}
