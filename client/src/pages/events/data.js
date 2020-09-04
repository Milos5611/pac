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
