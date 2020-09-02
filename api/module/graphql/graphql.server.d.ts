import { Binding, Constructor, Context, Server } from '@loopback/core';
import { HttpOptions, HttpServer } from '@loopback/http-server';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import express from 'express';
import { ResolverInterface } from 'type-graphql';
export { ContextFunction } from 'apollo-server-core';
export { ApolloServerExpressConfig } from 'apollo-server-express';
export { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
/**
 * Options for GraphQL server
 */
export interface GraphQLServerOptions extends HttpOptions {
    /**
     * GraphQL related configuration
     */
    graphql?: ApolloServerExpressConfig;
    /**
     * Express settings
     */
    express?: Record<string, unknown>;
    /**
     * Use as a middleware for RestServer instead of a standalone server
     */
    asMiddlewareOnly?: boolean;
}
/**
 * GraphQL Server
 */
export declare class GraphQLServer extends Context implements Server {
    private options;
    readonly httpServer?: HttpServer;
    readonly expressApp: express.Application;
    constructor(options?: GraphQLServerOptions, parent?: Context);
    getResolvers(): Constructor<ResolverInterface<object>>[];
    resolver(resolverClass: Constructor<ResolverInterface<object>>): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    get listening(): boolean;
}
export declare function registerResolver(ctx: Context, resolverClass: Constructor<object>): Binding;
