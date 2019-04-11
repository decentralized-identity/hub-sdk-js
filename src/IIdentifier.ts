
import IIdentifierDocument from './IIdentifierDocument';

/**
 * Interface for managing identifiers
 */
export default interface IIdentifier {
  /**
   * The string representation of the identier for the persona
   * in the format 'did:{method}:{id}'.
   */
  id: string;

  /**
   * The identifier document for the identifier
   * if one exists.
   */
  document: IIdentifierDocument | undefined;
}
