import {Location} from "./location-type";
import {field, inputType} from "@loopback/graphql";

@inputType()
export class LocationInput implements Partial<Location> {
  @field()
  id: string;

  @field()
  name: string;
}
