import {plainToClass} from 'class-transformer';
import {Talk} from "../graphql-types/talk/talk-type";

export const sampleTalk = [
    createTalk({
        id: "1",
        duration: 70,
        level: "Senior",
        language: "English",
        title: "JavaScript in real word"
    }),
    createTalk({
        id: "2",
        duration: 40,
        level: "Junior",
        language: "English",
        title: "Kubernetes and how to start"
    }),
    createTalk({
        id: "3",
        duration: 80,
        level: "Intermediate",
        language: "English",
        title: "JavaScript"
    }),
    createTalk({
        id: "4",
        duration: 90,
        level: "Senior",
        language: "English",
        title: "JavaScript"
    }),
    createTalk({
        id: "5",
        duration: 20,
        level: "Intermediate",
        language: "English",
        title: "JavaScript"
    }),
    createTalk({
        id: "6",
        duration: 90,
        level: "Senior",
        language: "English",
        title: "JavaScript"
    }),
    createTalk({
        id: "7",
        duration: 120,
        level: "Junior",
        language: "English",
        title: "JavaScript"
    }),
    createTalk({
        id: "8",
        duration: 50,
        level: "Intermediate",
        language: "English",
        title: "JavaScript"
    }),
    createTalk({
        id: "9",
        duration: 70,
        level: "Junior",
        language: "English",
        title: "JavaScript"
    })
];

function createTalk(talkData: Partial<Talk>): Talk {
    return plainToClass(Talk, talkData);
}
