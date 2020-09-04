import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Parent} from "../graphql-types/parent/parent-type";

export const sampleParent = [
    createParent({
        topicId: "1",
        name: faker.name.jobArea(),
    }),
    createParent( {
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "3",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "4",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "5",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createParent({
        topicId: "9",
        name: faker.name.jobArea(),
    }),
];

function createParent(parentData: Partial<Parent>): Parent {
    return plainToClass(Parent, parentData);
}
