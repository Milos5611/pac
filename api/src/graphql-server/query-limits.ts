import {
  ASTVisitor,
  GraphQLError,
  Kind,
  SelectionSetNode,
  ValidationContext,
} from 'graphql';

export interface QueryLimits {
  /** Deepest field nesting, counting the root field as 1. */
  maxDepth: number;
  /** Aliased fields per operation. Aliases let one request repeat a query. */
  maxAliases: number;
  /** Fields per operation after expanding fragments. */
  maxFields: number;
}

export const DEFAULT_QUERY_LIMITS: QueryLimits = {
  maxDepth: 10,
  maxAliases: 20,
  maxFields: 500,
};

class LimitExceeded extends Error {}

/**
 * GraphQL validation rule that rejects operations above the given depth,
 * alias and field counts before they execute. The introspection fields
 * `__schema` and `__type` are not counted, so schema tools keep working.
 */
export function queryLimitsRule(limits: QueryLimits = DEFAULT_QUERY_LIMITS) {
  return (context: ValidationContext): ASTVisitor => ({
    OperationDefinition(operation) {
      let aliases = 0;
      let fields = 0;
      let maxDepth = 0;
      let visited = 0;

      const reject = (message: string) => {
        context.reportError(
          new GraphQLError(message, {
            nodes: [operation],
            extensions: {code: 'GRAPHQL_VALIDATION_FAILED'},
          }),
        );
        throw new LimitExceeded();
      };

      // Walks the selection tree with fragments expanded. It stops at the first
      // exceeded limit, which also bounds the work a fragment bomb can cause.
      const walk = (
        selectionSet: SelectionSetNode,
        depth: number,
        fragmentPath: Set<string>,
      ) => {
        for (const selection of selectionSet.selections) {
          // Counts fragment spreads too, so even a chain of fragments that
          // expands to uncounted fields stays cheap to check
          if (++visited > limits.maxFields * 2) {
            reject('Query is too large');
          }
          if (selection.kind === Kind.FIELD) {
            const fieldName = selection.name.value;
            if (fieldName === '__schema' || fieldName === '__type') continue;
            if (++fields > limits.maxFields) {
              reject(`Query has more than ${limits.maxFields} fields`);
            }
            if (selection.alias && ++aliases > limits.maxAliases) {
              reject(`Query has more than ${limits.maxAliases} aliases`);
            }
            if (depth > maxDepth) maxDepth = depth;
            if (maxDepth > limits.maxDepth) {
              reject(`Query is deeper than ${limits.maxDepth} levels`);
            }
            if (selection.selectionSet) {
              walk(selection.selectionSet, depth + 1, fragmentPath);
            }
          } else if (selection.kind === Kind.INLINE_FRAGMENT) {
            walk(selection.selectionSet, depth, fragmentPath);
          } else {
            const name = selection.name.value;
            const fragment = context.getFragment(name);
            // Unknown and cyclic fragments are reported by graphql's own rules
            if (!fragment || fragmentPath.has(name)) continue;
            walk(
              fragment.selectionSet,
              depth,
              new Set([...fragmentPath, name]),
            );
          }
        }
      };

      try {
        walk(operation.selectionSet, 1, new Set());
      } catch (err) {
        if (!(err instanceof LimitExceeded)) throw err;
      }
    },
  });
}
