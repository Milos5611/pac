import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Parent} from "../graphql-types/parent/parent-type";

export const sampleParent = [
    addParentTopic("1", {
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("2", {
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("3",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("4",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("5",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
    addParentTopic("9",{
        id: faker.random.uuid(),
        name: faker.name.jobArea(),
    }),
];

function addParentTopic(topicId: string, parentData: Partial<Parent>): Parent {
    return plainToClass(Parent, parentData);
}
