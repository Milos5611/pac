import {field, inputType} from '../../../graphql';
import {Location} from "./location-type";

@inputType()
export class LocationInput implements Partial<Location> {
  @field()
  name: string;
}
