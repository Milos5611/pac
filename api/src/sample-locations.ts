// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {plainToClass} from 'class-transformer';
import {Location} from "./graphql-types/location/location-type";

export const sampleLocation = [
  createLocation({
    id: '13',
    name: "Titel"
  }),
  createLocation({
    id: '22',
    name: "Sombor"
  }),
  createLocation({
    id: '3',
    name: "Pirot"
  }),
];

function createLocation(locationData: Partial<Location>): Location {
  return plainToClass(Location, locationData);
}
