import { ICommitProtectedHeaders } from '@decentralized-identity/hub-common-js';
import RsaPrivateKey from '@decentralized-identity/did-auth-jose/dist/lib/crypto/rsa/RsaPrivateKey';
import { FlatJsonJwe, Secp256k1CryptoSuite } from '@decentralized-identity/did-auth-jose';
import Commit from '../../src/Commit';
import CommitProtector from '../../src/crypto/CommitProtector'
describe('CommitProtector', () => {

  describe('protect()', () => {

    fit('should protect a commit using Rsa', async () => {
      const testDid = 'did:example:person.id';
      const testKid = `${testDid}#key-1`;
      const signingKey = await RsaPrivateKey.generatePrivateKey(testKid);
      const encryptionKey = signingKey.getPublicKey();
      const protectedHeaders: Partial<ICommitProtectedHeaders> = {
        interface: 'Collections',
        context: 'schema.org',
        type: 'MusicPlaylist',
        operation: 'create',
        committed_at: '2019-01-01',
        commit_strategy: 'basic',
        sub: 'did:example:sub.id',
        // iss and kid left out intentionally
      };

      const payload = {
        name: "Test"
      };

      const commit = new Commit({
        protected: protectedHeaders,
        payload
      });

      const protecter = new CommitProtector({
        signingKey,
        encryptionKey,
        did: testDid
      });

      const protectedCommit = await protecter.protect(commit);

      expect(protectedCommit.ciphertext).toBeDefined();
      expect(protectedCommit.encrypted_key).toBeDefined();
      expect(protectedCommit.iv).toBeDefined();
      expect(protectedCommit.protected).toBeDefined();
      expect(protectedCommit.tag).toBeDefined();
      expect(protectedCommit.unprotected).toBeDefined();
      expect(protectedCommit.aad).toBeDefined();
/*
      const protectedProtectedHeaders = protectedCommit.getProtectedHeaders();
      Object.keys(protectedHeaders).forEach((headerKey) => {
        expect((protectedProtectedHeaders as any)[headerKey]).toEqual((protectedHeaders as any)[headerKey]);
      })

      expect(protectedProtectedHeaders.iss).toEqual(testDid);
      expect(protectedProtectedHeaders.kid).toEqual(testKid);
      */
    });
/***
    it('should protect a commit using EC', async () => {
      const testDid = 'did:example:person.id';
      const testKid = `${testDid}#key-1`;
      const testKey = await EcPrivateKey.generatePrivateKey(testKid);

      const protectedHeaders: Partial<ICommitProtectedHeaders> = {
        interface: 'Collections',
        context: 'schema.org',
        type: 'MusicPlaylist',
        operation: 'create',
        committed_at: '2019-01-01',
        commit_strategy: 'basic',
        sub: 'did:example:sub.id',
        // iss and kid left out intentionally
      };

      const payload = {
        name: "Test"
      };

      const commit = new Commit({
        protected: protectedHeaders,
        payload
      });

      const protecter = new CommitProtector({
        did: testDid,
        key: testKey,
        cryptoSuite: new Secp256k1CryptoSuite()
      });

      const protectedCommit = await protecter.protect(commit);

      expect(protectedCommit.getPayload()).toEqual(payload);

      const protectedProtectedHeaders = protectedCommit.getProtectedHeaders();
      Object.keys(protectedHeaders).forEach((headerKey) => {
        expect((protectedProtectedHeaders as any)[headerKey]).toEqual((protectedHeaders as any)[headerKey]);
      })

      expect(protectedProtectedHeaders.iss).toEqual(testDid);
      expect(protectedProtectedHeaders.kid).toEqual(testKid);
    });

    it('should throw an error if a commit is not valid', async () => {
      const testDid = 'did:example:person.id';
      const testKid = `${testDid}#key-1`;
      const testKey = await RsaPrivateKey.generatePrivateKey(testKid);

      const commit = new Commit({
        protected: {
          interface: 'Collections',
          context: 'schema.org',
          // type: 'MusicPlaylist', // left out intentionally
          operation: 'create',
          committed_at: '2019-01-01',
          commit_strategy: 'basic',
          sub: 'did:example:sub.id',
        },
        payload: {
          name: "Test"
        }
      });

      const protecter = new CommitProtector({
        did: testDid,
        key: testKey
      });

      try {
        await protecter.protect(commit);
        fail('Not expected to reach this point.');
      } catch (err) {
        expect(err.message).toContain("Commit 'protected.type' field must be");
      }
    });
**/
  });
});
