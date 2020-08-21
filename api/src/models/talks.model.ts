import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Languages} from './languages.model';
import {Rooms} from './rooms.model';

@model()
export class Talks extends Entity {
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

  @property({
    type: 'string',
    required: true,
  })
  duration: string;

  @property({
    type: 'string',
    required: true,
  })
  level: string;

  @belongsTo(() => Languages)
  languageId: string;

  @belongsTo(() => Rooms)
  roomId: string;

  constructor(data?: Partial<Talks>) {
    super(data);
  }
}

export interface TalksRelations {
  // describe navigational properties here
}

export type TalksWithRelations = Talks & TalksRelations;
