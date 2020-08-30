import { BindingKey, Constructor } from '@loopback/core';
import { ResolverData } from 'type-graphql';
import { GraphQLComponent } from './graphql.component';
import { GraphQLServer } from './graphql.server';
export declare namespace GraphQLBindings {
    const GRAPHQL_SERVER: BindingKey<GraphQLServer>;
    const COMPONENT: BindingKey<GraphQLComponent>;
    const RESOLVER_DATA: BindingKey<ResolverData<unknown>>;
    const RESOLVER_CLASS: BindingKey<Constructor<unknown>>;
    const RESOLVERS = "resolvers";
}
export declare namespace GraphQLTags {
    const GRAPHQL = "graphql";
    const RESOLVER = "graphql.resolver";
}
