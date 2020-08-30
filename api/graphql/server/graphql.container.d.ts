import { Constructor, Context } from '@loopback/core';
import { ContainerType, ResolverData } from 'type-graphql';
/**
 * Context for graphql resolver resolution
 */
export declare class GraphQLResolutionContext extends Context {
    readonly resolverClass: Constructor<unknown>;
    readonly resolverData: ResolverData<unknown>;
    constructor(parent: Context, resolverClass: Constructor<unknown>, resolverData: ResolverData<unknown>);
}
/**
 * Implementation of `ContainerType` to plug into `type-graphql` as the IoC
 * container
 */
export declare class LoopBackContainer implements ContainerType {
    readonly ctx: Context;
    constructor(ctx: Context);
    get(resolverClass: Constructor<unknown>, resolverData: ResolverData<unknown>): unknown;
}
