import {plainToClass} from 'class-transformer';
import {Location} from "../graphql-types/location/location-type";

export const sampleLocation = [
  createLocation({
    id: '1',
    name: "Beograd",
  }),
  createLocation({
    id: '2',
    name: "Pirot"
  }),
  createLocation({
    id: '3',
    name: "Negotin"
  }),
  createLocation({
    id: '4',
    name: "Smederevo"
  }),
  createLocation({
    id: '5',
    name: "Pozega"
  }),
  createLocation({
    id: '6',
    name: "Sid"
  }),
];

function createLocation(locationData: Partial<Location>): Location {
  return plainToClass(Location, locationData);
}
