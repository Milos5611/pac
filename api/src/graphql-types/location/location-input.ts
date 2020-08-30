import {field, inputType} from '../../../graphql/server';
import {Location} from "./location-type";

@inputType()
export class LocationInput implements Partial<Location> {
  @field()
  name: string;
}
