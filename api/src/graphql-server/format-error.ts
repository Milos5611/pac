import {GraphQLError, GraphQLFormattedError} from 'graphql';

/** Postgres error codes caused by bad input rather than a server fault. */
const POSTGRES_INPUT_ERRORS: Record<string, string> = {
  '23502': 'A required value is missing',
  '23503': 'A referenced record does not exist',
  '23505': 'A record with this value already exists',
  '22001': 'A value is too long',
  '22P02': 'A value has the wrong format',
};

interface ValidationErrorItem {
  property: string;
  constraints?: Record<string, string>;
  children?: ValidationErrorItem[];
}

function constraintMessages(items: ValidationErrorItem[]): string[] {
  return items.flatMap(item => [
    ...Object.values(item.constraints ?? {}),
    ...constraintMessages(item.children ?? []),
  ]);
}

/**
 * Builds Apollo's `formatError`. Errors that already carry a client-facing
 * code (UNAUTHENTICATED, BAD_USER_INPUT, ...) pass through. Known LoopBack and
 * Postgres errors get a proper code. Everything else is logged with its stack
 * and returned as a bare "Internal server error", so clients never see SQL,
 * table names or file paths.
 */
export function createErrorFormatter(logError: (message: string) => void) {
  return (
    formatted: GraphQLFormattedError,
    error: unknown,
  ): GraphQLFormattedError => {
    const code = formatted.extensions?.code;
    const location = {locations: formatted.locations, path: formatted.path};

    // class-validator failures: list the broken rules instead of the generic
    // "Argument Validation Error", and drop the echoed input values
    const validationErrors = formatted.extensions?.validationErrors;
    if (code === 'BAD_USER_INPUT' && Array.isArray(validationErrors)) {
      const items = validationErrors as ValidationErrorItem[];
      return {
        ...location,
        message: `Invalid input: ${constraintMessages(items).join('; ')}`,
        extensions: {
          code,
          validationErrors: items.map(({property, constraints}) => ({
            property,
            constraints,
          })),
        },
      };
    }

    if (code !== 'INTERNAL_SERVER_ERROR') return formatted;

    const original =
      (error instanceof GraphQLError && error.originalError) || error;
    const {
      code: originalCode,
      name,
      message,
      stack,
    } = original as Partial<Error> & {code?: string};

    if (originalCode === 'ENTITY_NOT_FOUND') {
      return {...location, message: message!, extensions: {code: 'NOT_FOUND'}};
    }
    // juggler's model validation (required properties and similar)
    if (name === 'ValidationError') {
      return {
        ...location,
        message: message!,
        extensions: {code: 'BAD_USER_INPUT'},
      };
    }
    if (originalCode && originalCode in POSTGRES_INPUT_ERRORS) {
      return {
        ...location,
        message: POSTGRES_INPUT_ERRORS[originalCode],
        extensions: {code: 'BAD_USER_INPUT'},
      };
    }

    const where = formatted.path?.join('.') ?? 'request';
    logError(`GraphQL error in ${where}: ${stack ?? message ?? original}`);
    return {
      ...location,
      message: 'Internal server error',
      extensions: {code: 'INTERNAL_SERVER_ERROR'},
    };
  };
}
