import {field, inputType} from '../../../graphql';
import {Room} from './room-type';

@inputType()
export class RoomInput implements Partial<Room> {
    @field({description: 'Person ID'})
    id: string;

    @field()
    name: string;

    @field()
    organization_id?: string;

    async getId() {}

    async getIdObject() {}

    async toJSON() {}

    async toObject() {}
}
