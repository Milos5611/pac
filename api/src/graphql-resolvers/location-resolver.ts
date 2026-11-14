import {arg, Ctx, mutation, query, resolver} from '@loopback/graphql';
import {repository} from '@loopback/repository';
import {requireUser} from '../auth/require-user';
import {LocationInput} from '../graphql-types/location/location-input';
import {Location} from '../graphql-types/location/location-type';
import {GraphQLContext} from '../helper';
import {LocationRepository} from '../repositories';

@resolver(of => Location)
export class LocationResolver {
  constructor(
    @repository('LocationRepository')
    private readonly repo: LocationRepository,
  ) {}

  @query(() => Location, {nullable: true})
  async location(@arg('locationId') id: string) {
    return this.repo.getOne(id);
  }

  @query(() => [Location])
  async locations(): Promise<Location[]> {
    return this.repo.getAll();
  }

  @mutation(() => Location)
  async createLocation(
    @arg('location') input: LocationInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Location> {
    await requireUser(context);
    return this.repo.createLocation(input);
  }
}
