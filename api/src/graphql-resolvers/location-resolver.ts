import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {Location} from '../graphql-types/location/location-type';
import {LocationRepository} from '../repositories';
import {LocationInput} from "../graphql-types/location/location-input";

@resolver(of => Location)
export class LocationResolver {
    constructor(
        @repository('LocationRepository')
        private readonly locationRepo: LocationRepository,
    ) {}

    @query(returns => Location, {nullable: true})
    async location(@arg('locationId') locationId: string) {
        return this.locationRepo.getOne(locationId);
    }

    @query(returns => [Location])
    async locations(): Promise<Location[]> {
        return this.locationRepo.getAll();
    }

    @mutation(returns => Location)
    async addLocation(@arg('location') location: LocationInput): Promise<Location | void> {
        return this.locationRepo.create(location);
    }
}
