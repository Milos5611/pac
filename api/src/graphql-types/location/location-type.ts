// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, ID, objectType} from '../../../graphql';
import {Entity, hasMany, model, property} from '@loopback/repository';
import {Event} from "../event/event-type";

@objectType({description: 'Object representing events'})
@model({settings: {strict: true}})
export class Location extends Entity {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  name: string;

  @hasMany(() => Event, {keyTo: 'location_id'})
  events: Event[];
}
