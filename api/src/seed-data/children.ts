import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Children} from "../graphql-types/children/children-type";

export const sampleChildren = [
    createChildren( {
        topicId:"1",
        name: faker.name.jobArea(),
    }),
    createChildren( {
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "4",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "5",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        topicId:"9",
        name: faker.name.jobArea(),
    }),
];

function createChildren(childrenData: Partial<Children>): Children {
    return plainToClass(Children, childrenData);
}
