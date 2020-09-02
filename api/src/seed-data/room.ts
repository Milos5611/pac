import {plainToClass} from 'class-transformer';
import faker from "faker";
import {Room} from "../graphql-types/room/room-type";
export const sampleRoom = [
    createRoom({
        id: "1",
        name: faker.commerce.department(),
        locationId: "4"
    }),
    createRoom({
        id: "2",
        name: faker.commerce.department(),
        locationId: "3"
    }),
    createRoom({
        id: "3",
        name: faker.commerce.department(),
        locationId: "5"
    }),
    createRoom({
        id: "4",
        name: faker.commerce.department(),
        locationId: "4"
    }),
    createRoom({
        id: "5",
        name: faker.commerce.department(),
        locationId: "1"
    }),
    createRoom({
        id: "6",
        name: faker.commerce.department(),
        locationId: "1"
    }),
    createRoom({
        id: "7",
        name: faker.commerce.department(),
        locationId: "2"
    }),
    createRoom({
        id: "8",
        name: faker.commerce.department(),
        locationId: "5"
    }),
    createRoom({
        id: "9",
        name: faker.commerce.department(),
        locationId: "6"
    })
];

function createRoom(roomData: Partial<Room>): Room {
    return plainToClass(Room, roomData);
}
