import {plainToClass} from 'class-transformer';
import {Person} from "../graphql-types/person/person-type";
import {v4 as uuid} from 'uuid';
import faker from "faker";
export const samplePerson = [
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "1",
        talkId: "1"
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "2",
        talkId: "2",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "3",
        talkId: "3",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "4",
        talkId: "4",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "2",
        talkId: "5",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "3",
        talkId: "6",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "2",
        talkId: "7",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "1",
        talkId: "8",
    }),
    createPerson({
        id: uuid(),
        name: faker.name.findName(),
        organizationId: "1",
        talkId: "9",
    })
];

function createPerson(personData: Partial<Person>): Person {
    return plainToClass(Person, personData);
}
