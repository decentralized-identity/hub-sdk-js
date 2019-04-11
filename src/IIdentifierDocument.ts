import { PublicKey } from '@decentralized-identity/did-auth-jose';

/**
 * Interface for creating and managing identifiers,
 * retrieving identifier documents.
 */
export interface IIdentifierDocument {

  /**
   * The identifier the document represents.
   */
  id: string;

  /**
   * The date the document was created.
   */
  created: Date | undefined;

  /**
   * Array of public keys added to the document.
   */
  publicKeys: Array<PublicKey>;
}
