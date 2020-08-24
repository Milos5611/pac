import {field, ID, objectType} from '../../../graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Language} from "../language/language-type";

@objectType({description: 'Object representing room'})
@model({
    settings: {
        "foreignKeys": {
            "fk_organization_id": {
                "name": "fk_language_id",
                "foreignKey": "language_id",
                "entityKey": "id",
                "entity": "language_id"
            }
        }
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
