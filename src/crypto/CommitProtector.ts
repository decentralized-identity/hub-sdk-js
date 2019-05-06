// tslint:disable-next-line:max-line-length
import { FlatJsonJwe, PrivateKey, PublicKey, JwsToken, JweToken, CryptoFactory, RsaCryptoSuite, AesCryptoSuite, CryptoSuite } from '@decentralized-identity/did-auth-jose';
import ICommitProtector from './ICommitProtector';
import Commit from '../Commit';
import objectAssign = require('object-assign');

interface CommitProtectorOptions {

  /** The DID of the identity that will the commit. */
  did: string;

  /** The private key to be used to sign the commit. */
  signingKey: PrivateKey;

  /** The public key to be used to encrypt the commit. */
  encryptionKey: PublicKey;

  /** The CryptoSuites to be used to protect the commit */
  cryptoSuites?: CryptoSuite[];

}

/**
 * Class which can apply a signature and encrypt a commit.
 */
export default class CommitProtector implements ICommitProtector {

  private did: string;
  private signingKey: PrivateKey;
  private encryptionKey: PublicKey;
  private cryptoSuites: CryptoSuite[];

  constructor(options: CommitProtectorOptions) {
    this.did = options.did;
    this.signingKey = options.signingKey;
    this.encryptionKey = options.encryptionKey;

    if (!options.cryptoSuites) {
      this.cryptoSuites = [new RsaCryptoSuite(), new AesCryptoSuite()];
    } else {
      this.cryptoSuites = options.cryptoSuites;
    }
  }

  /**
   * Signs the given commit.
   *
   * @param commit The commit to sign.
   */
  public async protect(commit: Commit): Promise<FlatJsonJwe> {

    commit.validate();

    const protectedHeaders = commit.getProtectedHeaders();
    const finalProtectedHeaders = objectAssign({}, protectedHeaders, {
      iss: this.did,
    });

    // Sign the payload
    const jws = new JwsToken(commit.getPayload(), new CryptoFactory(this.cryptoSuites));
    const signed = await jws.sign(this.signingKey, finalProtectedHeaders as any);

    const jwe = new JweToken(signed, new CryptoFactory(this.cryptoSuites));
    const encrypted = await jwe.encryptAsFlattenedJson(this.encryptionKey);
    return encrypted;
  }

}
