import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Topic} from "../graphql-types/topic/topic-type";

export const sampleTopic = [
    createTopic({
        id: "1",
        name: faker.name.jobArea(),
        talkId: "1",
    }),
    createTopic({
        id: "2",
        name: faker.name.jobArea(),
        talkId: "2"
    }),
    createTopic({
        id: "3",
        name: faker.name.jobArea(),
        talkId: "4"
    }),
    createTopic({
        id: "4",
        name: faker.name.jobArea(),
        talkId: "2"
    }),
    createTopic({
        id: "5",
        name: faker.name.jobArea(),
        talkId: "6"
    }),
    createTopic({
        id: "6",
        name: faker.name.jobArea(),
        talkId: "2"
    }),
    createTopic({
        id: "7",
        name: faker.name.jobArea(),
        talkId: "9"
    }),
    createTopic({
        id: "8",
        name: faker.name.jobArea(),
        talkId: "8"
    }),
    createTopic({
        id: "9",
        name: faker.name.jobArea(),
        talkId: "7"
    }),
    createTopic({
        id: "10",
        name: faker.name.jobArea(),
        talkId: "4"
    }),
];

function createTopic(topicData: Partial<Topic>): Topic {
    return plainToClass(Topic, topicData);
}
