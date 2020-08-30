"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLResolverDefaults = exports.GraphQLResolverBooter = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const debug_1 = tslib_1.__importDefault(require("debug"));
const getMetadataStorage_1 = require("type-graphql/dist/metadata/getMetadataStorage");
const graphql_server_1 = require("../graphql.server");
const debug = debug_1.default('loopback:graphql:resolver-booter');
/**
 * A class that extends BaseArtifactBooter to boot the 'GraphQLResolver' artifact type.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - GraphQLResolver Artifact Options Object
 */
let GraphQLResolverBooter = class GraphQLResolverBooter extends boot_1.BaseArtifactBooter {
    constructor(app, projectRoot, interceptorConfig = {}) {
        super(projectRoot, 
        // Set GraphQLResolver Booter Options if passed in via bootConfig
        Object.assign({}, exports.GraphQLResolverDefaults, interceptorConfig));
        this.app = app;
        this.interceptorConfig = interceptorConfig;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    async load() {
        await super.load();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resolverClasses = getMetadataStorage_1.getMetadataStorage()
            .resolverClasses;
        this.resolvers = this.classes.filter(cls => {
            return resolverClasses.some(r => !r.isAbstract && r.target === cls);
        });
        for (const resolver of this.resolvers) {
            debug('Bind interceptor: %s', resolver.name);
            const binding = graphql_server_1.registerResolver(this.app, resolver);
            debug('Binding created for interceptor: %j', binding);
        }
    }
};
GraphQLResolverBooter = tslib_1.__decorate([
    boot_1.booter('graphqlResolvers'),
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, core_1.inject(boot_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, core_1.config()),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, String, Object])
], GraphQLResolverBooter);
exports.GraphQLResolverBooter = GraphQLResolverBooter;
/**
 * Default ArtifactOptions for GraphQLResolverBooter.
 */
exports.GraphQLResolverDefaults = {
    dirs: ['graphql-resolvers'],
    extensions: ['.js'],
    nested: true,
};
//# sourceMappingURL=resolver.booter.js.map