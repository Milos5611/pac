// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Location} from "../location/location-type";

@objectType({description: 'Object representing events'})
@model({settings: {strict: true}})
export class Event extends Entity {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  name?: string;

  @field()
  @property()
  start_date?: Date;

  @field()
  @property()
  end_date?: Date;

  @field()
  @belongsTo(() => Location, {name: 'location'})
  location_id?: string;
}
