import {bind, inject, BindingScope, CoreBindings} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/extension-logging';
import {
    RoomRepository,
    OrganizationRepository,
    ChildrenRepository,
    PersonRepository,
    TalkRepository,
    TopicRepository,
    TopicChildrenRepository,
    EventRepository,
    LocationRepository
} from '../repositories';
import {repository} from '@loopback/repository';
import {sampleEvent, sampleLocation, sampleOrganization, samplePerson, sampleTalk} from "../seed-data";
import {sampleRoom} from "../seed-data/room";
import {sampleTopic} from "../seed-data/topic";
import {sampleChildren} from "../seed-data/children";
import {sampleParent} from "../seed-data/parent";

@bind({scope: BindingScope.TRANSIENT})
export class SeedService {
  constructor(
      @repository('RoomRepository')
      protected roomRepository: RoomRepository,
      @repository('OrganizationRepository')
      protected organizationRepository: OrganizationRepository,
      @repository('ChildrenRepository')
      protected childrenRepository: ChildrenRepository,
      @repository('PersonRepository')
      protected personRepository: PersonRepository,
      @repository('TalkRepository')
      protected talkRepository: TalkRepository,
      @repository('TopicRepository')
      protected topicRepository: TopicRepository,
      @repository('TopicChildrenRepository')
      protected topicChildrenRepository: TopicChildrenRepository,
      @repository('EventRepository')
      protected eventRepository: EventRepository,
      @repository('LocationRepository')
      protected locationRepository: LocationRepository,

      @inject(LoggingBindings.WINSTON_LOGGER)
      protected logger: WinstonLogger,
  ) {}

  async createLocation() {
    // Create Locations
    await this.locationRepository.createAll(sampleLocation);
  }
  async createEvent() {
    // Create Events
    await this.eventRepository.createAll(sampleEvent);
  }
  async createOrganization() {
    // Create Organization
    await this.organizationRepository.createAll(sampleOrganization);
  }
  async createPerson() {
    // Create Persons
    await this.personRepository.createAll(samplePerson);
  }
  async createTalk() {
    // Create Persons
     await this.talkRepository.createAll(sampleTalk);
  }
  async createRoom() {
      // Create Room
      await this.roomRepository.createAll(sampleRoom)
  }
  async createTopic() {
      // Create Topic
      await this.topicRepository.createAll(sampleTopic)
  }
  async createChildren() {
      // Create Children
      await this.topicRepository.createAll(sampleChildren)
  }
  async createParent() {
      // Create Parent
      await this.topicRepository.createAll(sampleParent)
  }
}
