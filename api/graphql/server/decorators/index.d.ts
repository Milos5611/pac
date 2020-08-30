import '@loopback/metadata';
import { Arg, Args, ArgsType, Field, FieldResolver, InputType, Mutation, ObjectType, Query, Resolver, Root } from 'type-graphql';
/**
 * Re-exporting type-graphql decorators as lower case versions for two purposes:
 * - To be consistent with LoopBack's naming convention of decorators
 * - Allow future possibility to add extra metadata in addition to type-graphql's
 * behavior, for example, mapping to LoopBack model properties
 */
export declare const arg: typeof Arg;
export declare const args: typeof Args;
export declare const argsType: typeof ArgsType;
export declare const fieldResolver: typeof FieldResolver;
export declare const mutation: typeof Mutation;
export declare const query: typeof Query;
export declare const resolver: typeof Resolver;
export declare const root: typeof Root;
export declare const field: typeof Field;
export declare const inputType: typeof InputType;
export declare const objectType: typeof ObjectType;
