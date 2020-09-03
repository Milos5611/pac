import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Children} from "../graphql-types/children/children-type";

export const sampleChildren = [
    addChildrenTopic("1", {
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2", {
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("3",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("4",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("5",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("9",{
        name: faker.name.jobArea(),
    }),
];

function addChildrenTopic(topicId: string, childrenData: Partial<Children>): Children {
    return plainToClass(Children, childrenData);
}
