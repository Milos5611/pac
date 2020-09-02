"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectType = exports.inputType = exports.field = exports.root = exports.resolver = exports.query = exports.mutation = exports.fieldResolver = exports.argsType = exports.args = exports.arg = void 0;
// Force require('reflect-metadata');
require("@loopback/metadata");
const type_graphql_1 = require("type-graphql");
/**
 * Re-exporting type-graphql decorators as lower case versions for two purposes:
 * - To be consistent with LoopBack's naming convention of decorators
 * - Allow future possibility to add extra metadata in addition to type-graphql's
 * behavior, for example, mapping to LoopBack model properties
 */
exports.arg = type_graphql_1.Arg;
exports.args = type_graphql_1.Args;
exports.argsType = type_graphql_1.ArgsType;
exports.fieldResolver = type_graphql_1.FieldResolver;
exports.mutation = type_graphql_1.Mutation;
exports.query = type_graphql_1.Query;
exports.resolver = type_graphql_1.Resolver;
exports.root = type_graphql_1.Root;
exports.field = type_graphql_1.Field;
exports.inputType = type_graphql_1.InputType;
exports.objectType = type_graphql_1.ObjectType;
//# sourceMappingURL=index.js.map