import {plainToClass} from 'class-transformer';
import {Talk} from "../graphql-types/talk/talk-type";
import faker from "faker";
export const sampleTalk = [
    createTalk({
        id: "1",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Senior",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "1"
    }),
    createTalk({
        id: "2",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Junior",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "3"
    }),
    createTalk({
        id: "3",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Intermediate",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "2"
    }),
    createTalk({
        id: "4",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Senior",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "7"
    }),
    createTalk({
        id: "5",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Intermediate",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "3"
    }),
    createTalk({
        id: "6",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Senior",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "9"
    }),
    createTalk({
        id: "7",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Junior",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "7"
    }),
    createTalk({
        id: "8",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Intermediate",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "1"
    }),
    createTalk({
        id: "9",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Junior",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "4"
    }),
    createTalk({
        id: "10",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Intermediate",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "5"
    }),
    createTalk({
        id: "11",
        duration: faker.random.number({min: 20, max: 45, precision: 5}),
        level: "Intermediate",
        language: "English",
        title: faker.commerce.productName(),
        roomId: "6"
    })
];

function createTalk(talkData: Partial<Talk>): Talk {
    return plainToClass(Talk, talkData);
}
