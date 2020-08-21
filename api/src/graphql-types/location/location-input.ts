// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, inputType} from '../../../graphql';
import {Location} from "./location-type";

@inputType()
export class LocationInput implements Partial<Location> {
  @field()
  id: string;

  @field()
  name: string;
}
