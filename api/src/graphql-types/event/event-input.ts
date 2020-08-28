import {field, inputType} from '../../../graphql';
import {Event} from './event-type';

@inputType()
export class EventInput implements Partial<Event> {
  @field()
  name: string;

  @field({nullable: true, defaultValue: new Date()})
  start_date?: Date;

  @field({nullable: true, defaultValue: new Date()})
  end_date?: Date;

  @field()
  location_id: string;
}

