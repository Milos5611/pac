import {EventInput} from "./event-input";
import {field, inputType} from "@loopback/graphql";

@inputType()
export class EventFilter implements Partial<EventInput> {
  @field({nullable: true})
  name?: string;

  @field({nullable: true})
  start_date?: Date;

  @field({nullable: true})
  end_date?: Date;

  @field({nullable: true})
  locationId: string;
}

