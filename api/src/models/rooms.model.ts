import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Organizations} from './organizations.model';

@model()
export class Rooms extends Entity {
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

  @belongsTo(() => Organizations)
  organizationId: string;

  constructor(data?: Partial<Rooms>) {
    super(data);
  }
}

export interface RoomsRelations {
  // describe navigational properties here
}

export type RoomsWithRelations = Rooms & RoomsRelations;
