
import { FlatJsonJws, Secp256k1CryptoSuite, CryptoFactory, JwsToken, RsaCryptoSuite } from '@decentralized-identity/did-auth-jose';
import IKeyStore from './IKeyStore';

 /**
  * Class to model protection mechanisms
  */
export default class Protect {
  /**
   * Sign the body for the registar
   * @param body Body to sign
   */
  public static async sign (
    body: string,
    keyStorageReference: string,
    keyStore: IKeyStore
  ): Promise<string> {
    const cryptoFactory = new CryptoFactory([new Secp256k1CryptoSuite(), new RsaCryptoSuite()]);
    const token = new JwsToken(body, cryptoFactory);
    // Get the key
    const jwk: any = await keyStore.get(keyStorageReference, false)
    .catch((err) => {
      throw new Error(`The key referenced by '${keyStorageReference}' is not available: '${err}'`);
    });

    switch (jwk.kty.toUpperCase()) {
      case 'RSA':
        jwk.defaultSignAlgorithm = 'RS256';
        break;

      case 'EC':
        jwk.defaultSignAlgorithm = 'ES256K';
        break;

      default:
        throw new Error(`The key type '${jwk.kty}' is not supported.`);
    }

    const signedRegistrationRequest: FlatJsonJws = await token.signAsFlattenedJson(jwk, {
      header: {
        alg: jwk.defaultSignAlgorithm,
        kid: jwk.kid,
        operation: 'create',
        proofOfWork: '{}'
      }
    });

    return JSON.stringify(signedRegistrationRequest);
  }
}
