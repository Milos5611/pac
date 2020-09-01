import {arg, mutation, query, resolver} from '../../module/graphql';
import {repository} from '@loopback/repository';
import {Location} from '../graphql-types/location/location-type';
import {LocationRepository} from '../repositories';
import {LocationInput} from "../graphql-types/location/location-input";

@resolver(() => Location)
export class LocationResolver {
    constructor(
        @repository('LocationRepository')
        private readonly locationRepo: LocationRepository,
    ) {}

    @query(() => Location, {nullable: true})
    async location(@arg('locationId') locationId: string) {
        return this.locationRepo.getOne(locationId);
    }

    @query(() => [Location])
    async locations(): Promise<Location[]> {
        return this.locationRepo.getAll();
    }

    @mutation(() => Location)
    async createLocation(@arg('location') location: LocationInput): Promise<Location> {
        return this.locationRepo.createLocation(location);
    }
}
