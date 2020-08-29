import {gql} from "apollo-boost";

export const EVENT_QUERY = gql`
    query Event($eventId: String!) {
        event(eventId: $eventId) {
            id
            name
            start_date
            end_date
            location_id
        }
    }
`;

export const LOCATION_QUERY = gql`
    query Location($locationId: String!) {
        event(locationId: $locationId) {
            id
            name
        }
    }
`;
