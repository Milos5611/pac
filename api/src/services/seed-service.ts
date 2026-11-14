import {BindingScope, injectable} from '@loopback/core';
import {Count, DataObject, Entity, repository} from '@loopback/repository';
import {
  ChildrenRepository,
  EventRepository,
  LocationRepository,
  OrganizationRepository,
  ParentRepository,
  PersonRepository,
  RoomRepository,
  TalkRepository,
  TopicRepository,
} from '../repositories';
import {
  sampleChildren,
  sampleEvent,
  sampleLocation,
  sampleOrganization,
  sampleParent,
  samplePerson,
  sampleRoom,
  sampleTalk,
  sampleTopic,
} from '../seed-data';

async function seedIfEmpty<T extends Entity>(
  repo: {
    count(): Promise<Count>;
    createAll(rows: DataObject<T>[]): Promise<T[]>;
  },
  rows: DataObject<T>[],
) {
  if ((await repo.count()).count === 0) {
    await repo.createAll(rows);
  }
}

@injectable({scope: BindingScope.TRANSIENT})
export class SeedService {
  constructor(
    @repository('RoomRepository')
    protected roomRepository: RoomRepository,
    @repository('OrganizationRepository')
    protected organizationRepository: OrganizationRepository,
    @repository('ChildrenRepository')
    protected childrenRepository: ChildrenRepository,
    @repository('ParentRepository')
    protected parentRepository: ParentRepository,
    @repository('PersonRepository')
    protected personRepository: PersonRepository,
    @repository('TalkRepository')
    protected talkRepository: TalkRepository,
    @repository('TopicRepository')
    protected topicRepository: TopicRepository,
    @repository('EventRepository')
    protected eventRepository: EventRepository,
    @repository('LocationRepository')
    protected locationRepository: LocationRepository,
  ) {}

  createLocation() {
    return seedIfEmpty(this.locationRepository, sampleLocation);
  }
  createEvent() {
    return seedIfEmpty(this.eventRepository, sampleEvent);
  }
  createOrganization() {
    return seedIfEmpty(this.organizationRepository, sampleOrganization);
  }
  createRoom() {
    return seedIfEmpty(this.roomRepository, sampleRoom);
  }
  createPerson() {
    return seedIfEmpty(this.personRepository, samplePerson);
  }
  createTalk() {
    return seedIfEmpty(this.talkRepository, sampleTalk);
  }
  createTopic() {
    return seedIfEmpty(this.topicRepository, sampleTopic);
  }
  createChildren() {
    return seedIfEmpty(this.childrenRepository, sampleChildren);
  }
  createParent() {
    return seedIfEmpty(this.parentRepository, sampleParent);
  }
}
