import { ArtifactOptions, BaseArtifactBooter } from '@loopback/boot';
import { Application, Constructor } from '@loopback/core';
declare type GraphQLResolverClass = Constructor<object>;
/**
 * A class that extends BaseArtifactBooter to boot the 'GraphQLResolver' artifact type.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param bootConfig - GraphQLResolver Artifact Options Object
 */
export declare class GraphQLResolverBooter extends BaseArtifactBooter {
    app: Application;
    interceptorConfig: ArtifactOptions;
    resolvers: GraphQLResolverClass[];
    constructor(app: Application, projectRoot: string, interceptorConfig?: ArtifactOptions);
    /**
     * Uses super method to get a list of Artifact classes. Boot each file by
     * creating a DataSourceConstructor and binding it to the application class.
     */
    load(): Promise<void>;
}
/**
 * Default ArtifactOptions for GraphQLResolverBooter.
 */
export declare const GraphQLResolverDefaults: ArtifactOptions;
export {};
