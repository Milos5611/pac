import {field, ID, objectType} from '../../../module/graphql';
import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Organization} from "../organization/organization-type";
import {Talk} from "../talk/talk-type";

@objectType({description: 'Object representing person'})
@model({
    settings: {
        foreignKeys: {
            fk_organization_id: {
                name: 'fk_organization_id',
                entity: 'Organization',
                entityKey: 'id',
                foreignKey: 'organization_id',
            },
            fk_talk_id: {
                name: 'fk_talk_id',
                entity: 'Talk',
                entityKey: 'id',
                foreignKey: 'talk_id',
            },
        },
    }
})
export class Person extends Entity {
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
    name: string;

    @field()
    @belongsTo(() => Organization, {keyFrom: "organizationId"}, {name: "organization_id"})
    organizationId: string;

    @field()
    @belongsTo(() => Talk, {keyFrom: "talkId"}, {name: "talk_id"})
    talkId: string;

    @field(type => Organization, {nullable: true})
    organization: Organization;

    @field(type => Talk, {nullable: true})
    talk: Talk;
}
