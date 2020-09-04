import {plainToClass} from 'class-transformer';
import {Event} from "../graphql-types/event/event-type";
import faker from "faker";

export const sampleEvent = [
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d067a277",
        name: "Methodological challenges and research methods.",
        locationId: "1",
        start_date: faker.date.between('2020-01-01', '2020-01-02'),
        end_date: faker.date.between('2020-01-04', '2020-01-06')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d067a2fn",
        name: "Opportunity generation and early business development.",
        locationId: "2",
        start_date: faker.date.between('2020-01-01', '2020-01-02'),
        end_date: faker.date.between('2020-01-04', '2020-01-06')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d0611isk",
        name: "Minority entrepreneurship.",
        locationId: "3",
        start_date: faker.date.between('2020-01-07', '2020-01-07'),
        end_date: faker.date.between('2020-01-09', '2020-01-10')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06jaada",
        name: "Technology and knowledge-based entrepreneurship.",
        locationId: "3",
        start_date: faker.date.between('2020-01-06', '2020-01-07'),
        end_date: faker.date.between('2020-01-09', '2020-01-12')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d060aeh3",
        name: "Family business, succession and business transfer.",
        locationId: "2",
        start_date: faker.date.between('2020-01-09', '2020-01-19'),
        end_date: faker.date.between('2020-01-19', '2020-01-21')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06p3847",
        name: "Entrepreneurship education, learning, and knowledge dissemination.",
        locationId: "1",
        start_date: faker.date.between('2020-01-05', '2020-01-06'),
        end_date: faker.date.between('2020-01-08', '2020-01-09')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06palej",
        name: "Entrepreneurship education, learning, and knowledge dissemination.",
        locationId: "1",
        start_date: faker.date.between('2020-01-11', '2020-01-12'),
        end_date: faker.date.between('2020-01-22', '2020-01-24')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d0673jsdu",
        name: "Human and social capital",
        locationId: "1",
        start_date: faker.date.between('2020-01-02', '2020-01-02'),
        end_date: faker.date.between('2020-01-04', '2020-01-06')
    }),
    createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06mxksu",
        name: "Policy, support systems and infrastructure",
        locationId: "5",
        start_date: faker.date.between('2020-01-01', '2020-01-02'),
        end_date: faker.date.between('2020-01-04', '2020-01-06')
    })
    ,createEvent({
        id: "e6c6d273-b2d3-4bb6-bcc3-aeb4d06aopdy",
        name: "Authentic entrepreneurial leadership",
        locationId: "4",
        start_date: faker.date.between('2020-01-07', '2020-01-08'),
        end_date: faker.date.between('2020-01-09', '2020-01-10')
    }),
];

function createEvent(eventsData: Partial<Event>): Event {
    return plainToClass(Event, eventsData);
}
