
import { IIdentifier } from './IIdentifier';
import { IIdentifierDocument } from './IIdentifierDocument';

/**
 * Interface defining methods and properties to
 * be implemented by specific resolver methods.
 */
export default interface IResolver {
  /**
   * Returns the identifier document for the specified
   * identifier.
   * @param identifier for which to return the identifier document.
   */
  resolve (identifier: IIdentifier): Promise<IIdentifierDocument>;
}
