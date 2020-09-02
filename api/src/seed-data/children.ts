import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Parent} from "../graphql-types/parent/parent-type";
import {Children} from "../graphql-types/children/children-type";

export const sampleChildren = [
    createChildren({
        id: "1",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "2",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "3",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "4",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "5",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "6",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "7",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "8",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "9",
        name: faker.name.jobArea(),
    }),
    createChildren({
        id: "10",
        name: faker.name.jobArea(),
    }),
];

function createChildren(childrenData: Partial<Children>): Children {
    return plainToClass(Children, childrenData);
}
