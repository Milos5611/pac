import {Entity, model, property} from '@loopback/repository';

@model()
export class Languages extends Entity {
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

  constructor(data?: Partial<Languages>) {
    super(data);
  }
}

export interface LanguagesRelations {
  // describe navigational properties here
}

export type LanguagesWithRelations = Languages & LanguagesRelations;
