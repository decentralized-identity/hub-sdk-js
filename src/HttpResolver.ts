
import 'isomorphic-fetch';
import IIdentifier from './IIdentifier';
import IIdentifierDocument from './IIdentifierDocument';
import IResolver from './IResolver';
import { HubSessionOptions } from './HubSession';
declare var fetch: any;

/**
 * Fetches DID Documents from remote resolvers over http
 * @class
 * @implements Resolver
 */
export default class HttpResolver implements IResolver {
  private timeoutInMilliseconds: number;

  /**
   * Constructs an instance of the HttpResolver class.
   * @param url of the remote resolver.
   * @param [options] for configuring the resolver.
   */
  constructor (public url: string, public options?: HubSessionOptions) {
    // Format the url
    const slash = url.endsWith('/') ? '' : '/';
    this.url = `${url}${slash}1.0/identifiers/`;

    this.timeoutInMilliseconds =
    1000 *
    (!this.options || !this.options.timeoutInSeconds
      ? 30
      : this.options.timeoutInSeconds);
  }

  /**
   * Sends a fetch request to the resolver URL including the
   * specified identifier.
   * @param identifier to resolve.
   */
  public async resolve (identifier: IIdentifier): Promise<IIdentifierDocument> {
    const query = `${this.url}${identifier.id}`;
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Fetch timed out.')), this.timeoutInMilliseconds);

      // Now call the actual fetch with the updated options
      const response = await fetch(query);

      // Got a response so clear the timer
      clearTimeout(timer);

      // Check if the response was OK, and
      // if not return the appropriate error
      if (!response.ok) {
        let error: Error;
        switch (response.status) {
          case 404:
            error = new Error(`Identifier document not found for '${identifier.id}'`);
            break;
          default:
            error = new Error(`Resolver at '${this.url}' returned an error with '${response.statusText}'`);
        }

        // Reject the promise
        reject(error);
        return;
      }

      const responseJson = await response.json();
      const identifierDocument = responseJson.document || responseJson;
      resolve(identifierDocument);
    });
  }
}
