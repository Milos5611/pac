// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, inputType} from '../../../graphql';
import {Event} from './event-type';

@inputType()
export class EventInput implements Partial<Event> {
  @field({description: 'Event ID'})
  id: string;

  @field({nullable: true})
  name?: string;

  @field({nullable: true})
  start_date?: Date;

  @field({nullable: true})
  end_date?: Date;

  @field({nullable: true})
  location_id?: string;

  async getId() {}

  async getIdObject() {}

  async toJSON() {}

  async toObject() {}
}
