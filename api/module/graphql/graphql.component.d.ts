import { Binding, Component } from '@loopback/core';
import { GraphQLComponentOptions } from './types';
/**
 * Component for GraphQL
 */
export declare class GraphQLComponent implements Component {
    private options;
    bindings: Binding[];
    constructor(options?: GraphQLComponentOptions);
}
