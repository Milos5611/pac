import {Room} from '../graphql-types/room/room-type';

export const sampleRoom: Partial<Room>[] = [
  {id: '1', name: 'Main Hall', locationId: '4'},
  {id: '2', name: 'Auditorium', locationId: '3'},
  {id: '3', name: 'Danube Room', locationId: '5'},
  {id: '4', name: 'Workshop Room', locationId: '4'},
  {id: '5', name: 'Sava Hall', locationId: '1'},
  {id: '6', name: 'Room 101', locationId: '1'},
  {id: '7', name: 'Petrovaradin Room', locationId: '2'},
  {id: '8', name: 'Ballroom', locationId: '5'},
  {id: '9', name: 'Conference Room A', locationId: '6'},
];
