import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Children} from "../graphql-types/children/children-type";

export const sampleChildren = [
    addChildrenTopic("1", {
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2", {
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("3",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("4",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("5",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addChildrenTopic("9",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
];

function addChildrenTopic(topicId: string, childrenData: Partial<Children>): Children {
    return plainToClass(Children, childrenData);
}
