import {Event} from './event-type';
import {field, inputType} from '@loopback/graphql';
import {NonBlank, RefId} from '../validators';

@inputType()
export class EventInput implements Partial<Event> {
  @field()
  @NonBlank()
  name: string;

  // On update, an omitted date keeps its stored value and null clears it
  @field({nullable: true})
  start_date?: Date;

  @field({nullable: true})
  end_date?: Date;

  @field()
  @RefId()
  locationId: string;
}
