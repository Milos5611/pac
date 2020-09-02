import {plainToClass} from 'class-transformer';
import {Location} from "../graphql-types/location/location-type";
import faker from "faker";
export const sampleLocation = [
  createLocation({
    id: '1',
    name: faker.address.city(),
  }),
  createLocation({
    id: '2',
    name: faker.address.city()
  }),
  createLocation({
    id: '3',
    name: faker.address.city()
  }),
  createLocation({
    id: '4',
    name: faker.address.city()
  }),
  createLocation({
    id: '5',
    name: faker.address.city()
  }),
  createLocation({
    id: '6',
    name: faker.address.city()
  }),
];

function createLocation(locationData: Partial<Location>): Location {
  return plainToClass(Location, locationData);
}
