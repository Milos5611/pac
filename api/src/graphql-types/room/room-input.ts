import {Room} from './room-type';
import {field, inputType} from '@loopback/graphql';
import {NonBlank, RefId} from '../validators';

@inputType()
export class RoomInput implements Partial<Room> {
  @field()
  @NonBlank()
  name: string;

  @field()
  @RefId()
  locationId: string;
}
