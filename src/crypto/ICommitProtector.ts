import Commit from '../Commit';
import { FlatJsonJwe } from '@decentralized-identity/did-auth-jose';

/**
 * Interface representing an object which can protect (encrypt and sign) a commit.
 */
export default interface ICommitProtector {

  /**
   * Protects the given commit.
   *
   * @param commit The commit to protect.
   */
  protect(commit: Commit): Promise<FlatJsonJwe>;

}
