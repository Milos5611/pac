import {repository} from '@loopback/repository';
import {Location} from '../graphql-types/location/location-type';
import {LocationRepository} from '../repositories';
import {LocationInput} from "../graphql-types/location/location-input";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper";
import {parseToken} from "../helper/util";
import {arg, mutation, query, resolver} from "@loopback/graphql";

@resolver(of => Location)
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
    async createLocation(
        @arg('location') location: LocationInput,
        @Ctx() context: ContextTypes
    ): Promise<Location | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.locationRepo.createLocation(location);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
