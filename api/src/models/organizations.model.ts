import {Entity, model, property} from '@loopback/repository';

@model()
export class Organizations extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<Organizations>) {
    super(data);
  }
}

export interface OrganizationsRelations {
  // describe navigational properties here
}

export type OrganizationsWithRelations = Organizations & OrganizationsRelations;
