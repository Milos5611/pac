"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopBackContainer = exports.GraphQLResolutionContext = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const keys_1 = require("./keys");
const debug = debug_1.default('loopback:graphql:container');
/**
 * Context for graphql resolver resolution
 */
class GraphQLResolutionContext extends core_1.Context {
    constructor(parent, resolverClass, resolverData) {
        super(parent);
        this.resolverClass = resolverClass;
        this.resolverData = resolverData;
        this.bind(keys_1.GraphQLBindings.RESOLVER_DATA).to(resolverData);
        this.bind(keys_1.GraphQLBindings.RESOLVER_CLASS).to(resolverClass);
    }
}
exports.GraphQLResolutionContext = GraphQLResolutionContext;
/**
 * Implementation of `ContainerType` to plug into `type-graphql` as the IoC
 * container
 */
class LoopBackContainer {
    constructor(ctx) {
        this.ctx = ctx;
    }
    get(resolverClass, resolverData) {
        debug('Resolving a resolver %s', resolverClass.name, resolverData);
        const resolutionCtx = new GraphQLResolutionContext(this.ctx, resolverClass, resolverData);
        const resolverBinding = core_1.createBindingFromClass(resolverClass, {
            defaultNamespace: 'resolvers',
        });
        // Find resolver bindings that match the class
        const bindings = this.ctx
            .findByTag(keys_1.GraphQLTags.RESOLVER)
            .filter(core_1.filterByServiceInterface(resolverClass));
        if (bindings.length === 0) {
            // No explicit binding found
            debug('Resolver %s not found in context %s', resolverClass.name, this.ctx.name);
            // Let's use the resolution context to resolve it from the class
            resolutionCtx.add(resolverBinding);
            return resolutionCtx.getValueOrPromise(resolverBinding.key);
        }
        let found;
        if (bindings.length === 1) {
            // Only one found, use it
            found = bindings[0];
        }
        else {
            // Narrow down by key
            found = bindings.find(core_1.filterByKey(resolverBinding.key));
            if (!found) {
                found = bindings[0];
            }
        }
        debug('Resolver %s found in context %s', resolverClass.name, resolutionCtx.name, found);
        return resolutionCtx.getValueOrPromise(found.key);
    }
}
exports.LoopBackContainer = LoopBackContainer;
//# sourceMappingURL=graphql.container.js.map