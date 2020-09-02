import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Parent} from "../graphql-types/parent/parent-type";

export const sampleParent = [
    createParent({
        id: "1",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "2",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "3",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "4",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "5",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "6",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "7",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "8",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "9",
        name: faker.name.jobArea(),
    }),
    createParent({
        id: "10",
        name: faker.name.jobArea(),
    }),
];

function createParent(parentData: Partial<Parent>): Parent {
    return plainToClass(Parent, parentData);
}
