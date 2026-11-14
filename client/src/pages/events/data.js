export const EVENTS_QUERY = `
  query Events {
    events {
      id
      name
      start_date
      end_date
      location {
        name
        rooms {
          name
          talks {
            topics {
              name
            }
          }
        }
      }
    }
  }
`;

export const EVENT_QUERY = `
  query Event($eventId: String!) {
    event(eventId: $eventId) {
      id
      name
      start_date
      end_date
      location {
        name
        rooms {
          name
          talks {
            id
            duration
            title
            level
            topics {
              name
              childrens {
                name
              }
              parents {
                name
              }
            }
          }
        }
      }
    }
  }
`;
