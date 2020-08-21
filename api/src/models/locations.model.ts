import {Entity, model, property} from '@loopback/repository';

@model()
export class Locations extends Entity {
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

  constructor(data?: Partial<Locations>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
}

export type LocationWithRelations = Locations & LocationRelations;
