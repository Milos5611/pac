import {gql} from "apollo-boost";

export const FILTER_EVENTS_QUERY = gql`
    query Events(
        $name: String,
        $start_date: DateTime,
        $end_date: DateTime,
        $locationId: String
    ){
        events(filter: {
            name: $name,
            start_date: $start_date,
            end_date: $end_date,
            locationId: $locationId
        }) {
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


