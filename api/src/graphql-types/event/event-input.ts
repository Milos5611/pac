import {Event} from './event-type';
import {field, inputType} from "@loopback/graphql";

@inputType()
export class EventInput implements Partial<Event> {
  @field()
  name: string;

  @field({nullable: true, defaultValue: new Date()})
  start_date?: Date;

  @field({nullable: true, defaultValue: new Date()})
  end_date?: Date;

  @field()
  locationId: string;
}

