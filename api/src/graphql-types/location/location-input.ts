import {field, inputType} from '../../../module/graphql';
import {Location} from "./location-type";

@inputType()
export class LocationInput implements Partial<Location> {
  @field()
  id: string;

  @field()
  name: string;
}
