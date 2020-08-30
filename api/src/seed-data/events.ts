import {plainToClass} from 'class-transformer';
import {Event} from "../graphql-types/event/event-type";

export const sampleEvent = [
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d067a277",
        name: "Simple Event",
        locationId: "1",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d067a2fn",
        name: "Simple Event",
        locationId: "2",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d0611isk",
        name: "Simple Event",
        locationId: "3",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06jaada",
        name: "Simple Event",
        locationId: "3",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d060aeh3",
        name: "Simple Event",
        locationId: "2",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06p3847",
        name: "Simple Event",
        locationId: "1",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06palej",
        name: "Simple Event",
        locationId: "1",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d0673jsdu",
        name: "Simple Event",
        locationId: "1",
        start_date: new Date(),
        end_date: new Date()
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06mxksu",
        name: "Simple Event",
        locationId: "5",
        start_date: new Date(),
        end_date: new Date()
    }),createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06aopdy",
        name: "Simple Event",
        locationId: "4",
        start_date: new Date(),
        end_date: new Date()
    }),
];

function createEvent(eventsData: Partial<Event>): Event {
    return plainToClass(Event, eventsData);
}
