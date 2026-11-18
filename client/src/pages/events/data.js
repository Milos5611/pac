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
            title
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
      locationId
      location {
        id
        name
        rooms {
          id
          name
          talks {
            id
            duration
            title
            level
            language
            topics {
              name
            }
            persons {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const LOCATIONS_QUERY = `
  query Locations {
    locations {
      id
      name
    }
  }
`;

export const CREATE_LOCATION = `
  mutation CreateLocation($location: LocationInput!) {
    createLocation(location: $location) {
      id
      name
    }
  }
`;

export const CREATE_EVENT = `
  mutation CreateEvent($event: EventInput!) {
    createEvent(event: $event) {
      id
    }
  }
`;

export const UPDATE_EVENT = `
  mutation UpdateEvent($id: String!, $event: EventInput!) {
    updateEvent(id: $id, event: $event) {
      id
    }
  }
`;

export const DELETE_EVENT = `
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id)
  }
`;

export const CREATE_ROOM = `
  mutation CreateRoom($room: RoomInput!) {
    createRoom(room: $room) {
      id
    }
  }
`;

export const CREATE_TALK = `
  mutation CreateTalk($talk: TalkInput!) {
    createTalk(talk: $talk) {
      id
    }
  }
`;
