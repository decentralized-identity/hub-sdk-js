
import { ProtectionFormat } from './ProtectionFormat';
import { PrivateKey, PublicKey } from '@decentralized-identity/did-auth-jose';

/**
 * Interface defining methods and properties to
 * be implemented by specific key stores.
 */
export default interface IKeyStore {
  /**
   * Returns the key associated with the specified
   * key reference.
   * @param keyIdentifier for which to return the key.
   * @param publicKeyOnly True if only the public key is needed.
   */
  get (keyReference: string, publicKeyOnly: boolean): Promise<Buffer | PrivateKey | PublicKey>;

  /**
   * Saves the specified key to the key store using
   * the key reference.
   * @param keyReference Reference for the key being saved.
   * @param key being saved to the key store.
   */
  save (keyReference: string, key: Buffer | PrivateKey): Promise<void>;

  /**
   * Sign the data with the key referenced by keyReference.
   * @param keyReference Reference to the key used for signature.
   * @param data Data to sign
   * @param format Protection format used to sign and/or encrypt data
   */
  protect (keyReference: string, data: string, format: ProtectionFormat): Promise<string>;
}
