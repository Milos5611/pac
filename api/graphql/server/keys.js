"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLTags = exports.GraphQLBindings = void 0;
const core_1 = require("@loopback/core");
var GraphQLBindings;
(function (GraphQLBindings) {
    GraphQLBindings.GRAPHQL_SERVER = core_1.BindingKey.create('servers.GraphQLServer');
    GraphQLBindings.COMPONENT = core_1.BindingKey.create('components.GraphQLComponent');
    GraphQLBindings.RESOLVER_DATA = core_1.BindingKey.create('graphql.resolverData');
    GraphQLBindings.RESOLVER_CLASS = core_1.BindingKey.create('graphql.resolverClass');
    GraphQLBindings.RESOLVERS = 'resolvers';
})(GraphQLBindings = exports.GraphQLBindings || (exports.GraphQLBindings = {}));
var GraphQLTags;
(function (GraphQLTags) {
    GraphQLTags.GRAPHQL = 'graphql';
    GraphQLTags.RESOLVER = 'graphql.resolver';
})(GraphQLTags = exports.GraphQLTags || (exports.GraphQLTags = {}));
//# sourceMappingURL=keys.js.map