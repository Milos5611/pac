import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Language} from "../language/language-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {
       strict: true
    }
})
export class Talk extends Entity {
    @field(type => ID)
    @property({
        type: 'string',
        id: true,
        defaultFn: 'uuidv4',
        postgresql: {
            dataType: 'uuid',
        },
    })
    id: string;

    @field()
    @property()
    duration: number;

    @field()
    @property()
    level: string;

    @belongsTo(() => Language, {name: 'language'})
    language_id: string;
}
