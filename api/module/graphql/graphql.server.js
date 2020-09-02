"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResolver = exports.GraphQLServer = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const http_server_1 = require("@loopback/http-server");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = tslib_1.__importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const graphql_container_1 = require("./graphql.container");
const keys_1 = require("./keys");
/**
 * GraphQL Server
 */
let GraphQLServer = class GraphQLServer extends core_1.Context {
    constructor(options = {}, parent) {
        super(parent, 'graphql-server');
        this.options = options;
        this.expressApp = express_1.default();
        if (options.express) {
            for (const p in options.express) {
                this.expressApp.set(p, options.express[p]);
            }
        }
        if (!options.asMiddlewareOnly) {
            this.httpServer = new http_server_1.HttpServer(this.expressApp, this.options);
        }
    }
    getResolvers() {
        const view = this.createView(core_1.filterByTag(keys_1.GraphQLTags.RESOLVER));
        return view.bindings
            .filter(b => b.valueConstructor != null)
            .map(b => b.valueConstructor);
    }
    resolver(resolverClass) {
        registerResolver(this, resolverClass);
    }
    async start() {
        var _a, _b;
        const resolverClasses = this.getResolvers();
        // build TypeGraphQL executable schema
        const schema = await type_graphql_1.buildSchema({
            // See https://github.com/MichalLytek/type-graphql/issues/150#issuecomment-420181526
            validate: false,
            resolvers: resolverClasses,
            // automatically create `schema.gql` file with schema definition in current folder
            // emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
            container: new graphql_container_1.LoopBackContainer(this),
        });
        // Allow a graphql context resolver to be bound to GRAPHQL_CONTEXT_RESOLVER
        const graphqlContextResolver = (_a = (await this.get(keys_1.GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER, {
            optional: true,
        }))) !== null && _a !== void 0 ? _a : (context => context);
        const serverConfig = {
            // enable GraphQL Playground
            playground: true,
            context: graphqlContextResolver,
            ...this.options.graphql,
            schema,
        };
        // Create GraphQL server
        const graphQLServer = new apollo_server_express_1.ApolloServer(serverConfig);
        graphQLServer.applyMiddleware({ app: this.expressApp });
        await ((_b = this.httpServer) === null || _b === void 0 ? void 0 : _b.start());
    }
    async stop() {
        var _a;
        await ((_a = this.httpServer) === null || _a === void 0 ? void 0 : _a.stop());
    }
    get listening() {
        var _a;
        return !!((_a = this.httpServer) === null || _a === void 0 ? void 0 : _a.listening);
    }
};
GraphQLServer = tslib_1.__decorate([
    core_1.lifeCycleObserver('server', {
        scope: core_1.BindingScope.SINGLETON,
        tags: { [core_1.ContextTags.KEY]: keys_1.GraphQLBindings.GRAPHQL_SERVER },
    }),
    tslib_1.__param(0, core_1.config()),
    tslib_1.__param(1, core_1.inject.context()),
    tslib_1.__metadata("design:paramtypes", [Object, core_1.Context])
], GraphQLServer);
exports.GraphQLServer = GraphQLServer;
function registerResolver(ctx, resolverClass) {
    const binding = core_1.createBindingFromClass(resolverClass, {
        namespace: keys_1.GraphQLBindings.RESOLVERS,
    }).tag(keys_1.GraphQLTags.RESOLVER);
    ctx.add(binding);
    return binding;
}
exports.registerResolver = registerResolver;
//# sourceMappingURL=graphql.server.js.map