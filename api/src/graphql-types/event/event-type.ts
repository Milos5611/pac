import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Location} from "../location/location-type";

@objectType({description: 'Object representing events'})
@model({
  settings: {
    foreignKeys: {
      fk_location_id: {
        name: 'fk_location_id',
        entity: 'Location',
        entityKey: 'id',
        foreignKey: 'location_id',
      },
    },
  }
})
export class Event extends Entity {
  @field(type => ID)
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @field()
  @property()
  name: string;

  @field({nullable: true})
  @property()
  start_date?: Date;

  @field({nullable: true})
  @property()
  end_date?: Date;

  @field()
  @belongsTo(() => Location, {keyFrom: "locationId"},{name: "location_id"})
  locationId: string;

  @field(type => Location, {nullable: true})
  location: Location;
}
