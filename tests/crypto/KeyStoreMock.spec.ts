
import KeyStoreMock from './KeyStoreMock';
import { ProtectionFormat } from '../../src/crypto/ProtectionFormat';
import { EcPrivateKey, PrivateKeyRsa, PrivateKey } from '@decentralized-identity/did-auth-jose';

describe('KeyStoreMock', () => {

  it('should create a new EC signature', async (done) => {

    const jwk = await EcPrivateKey.generatePrivateKey('key1');

    // Setup registration environment
    const keyStore = new KeyStoreMock();
    await keyStore.save('key', jwk);
    const signature = await keyStore.protect('key', 'abc', ProtectionFormat.FlatJsonJws);
    expect(signature).toBeDefined();
    done();
  });

  it('should create a new RSA signature', async (done) => {

    const jwk = await PrivateKeyRsa.generatePrivateKey('key1');

    // Setup registration environment
    const keyStore = new KeyStoreMock();
    await keyStore.save('key', jwk);
    const signature = await keyStore.protect('key', 'abc', ProtectionFormat.FlatJsonJws);
    expect(signature).toBeDefined();
    done();
  });

  it('should throw because key is not found in store', async (done) => {

    // Setup registration environment
    const keyStore = new KeyStoreMock();
    let throwCaught = false;
    const signature = await keyStore.protect('key', 'abc', ProtectionFormat.FlatJsonJws)
    .catch(() => {
      throwCaught = true;
    });
    expect(signature).toBeUndefined();
    expect(throwCaught).toBe(true);
    done();
  });

  it('should throw because key type is not supported', async (done) => {

    // Setup registration environment
    const keyStore = new KeyStoreMock();
    const jwk: any = {
      kid: 'key1',
      use: 'sig',
      kty: 'oct',
      k: 'AAEE'
    };

    await keyStore.save('key', jwk);

    let throwCaught = false;
    const signature = await keyStore.protect('key', 'abc', ProtectionFormat.FlatJsonJws)
    .catch(() => {
      throwCaught = true;
    });
    expect(signature).toBeUndefined();
    expect(throwCaught).toBe(true);
    done();
  });
});
