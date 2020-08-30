"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const resolver_booter_1 = require("./booters/resolver.booter");
const graphql_server_1 = require("./graphql.server");
/**
 * Component for GraphQL
 */
let GraphQLComponent = class GraphQLComponent {
    constructor(options = {}) {
        this.options = options;
        this.bindings = [
            core_1.createBindingFromClass(graphql_server_1.GraphQLServer),
            core_1.createBindingFromClass(resolver_booter_1.GraphQLResolverBooter),
        ];
    }
};
GraphQLComponent = tslib_1.__decorate([
    tslib_1.__param(0, core_1.config()),
    tslib_1.__metadata("design:paramtypes", [Object])
], GraphQLComponent);
exports.GraphQLComponent = GraphQLComponent;
//# sourceMappingURL=graphql.component.js.map