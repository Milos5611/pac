import {gql} from "apollo-boost";
export const EVENTS_QUERY = gql`
{
    events {
       id
       name
       start_date
       end_date
       location{
         name
         rooms{
           name
           talks{
            topics {
              name
            }
          }
        }
      }
    }
}
`;

export const EVENT_QUERY = gql`
query Event($eventId: String!) {
    event(eventId: $eventId) {
       id
       name
       start_date
       end_date
       location{
         name
         rooms{
           name
           talks{
            duration
            title
            level
            topics {
            name
            childrens {
              name
            }
            parents{
               name
            }
          }
          }
        }
      }
    }
}
`;
