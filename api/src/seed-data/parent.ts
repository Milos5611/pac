import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Parent} from "../graphql-types/parent/parent-type";

export const sampleParent = [
    addParentTopic("1", {
        name: faker.name.jobArea(),
    }),
    addParentTopic("2", {
        name: faker.name.jobArea(),
    }),
    addParentTopic("3",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("4",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("5",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("2",{
        name: faker.name.jobArea(),
    }),
    addParentTopic("9",{
        name: faker.name.jobArea(),
    }),
];

function addParentTopic(topicId: string, parentData: Partial<Parent>): Parent {
    return plainToClass(Parent, parentData);
}
