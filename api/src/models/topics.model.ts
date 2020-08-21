import {Entity, model, property} from '@loopback/repository';

@model()
export class Topics extends Entity {
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

  constructor(data?: Partial<Topics>) {
    super(data);
  }
}

export interface TopicsRelations {
  // describe navigational properties here
}

export type TopicsWithRelations = Topics & TopicsRelations;
