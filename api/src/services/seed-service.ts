import {bind, inject, BindingScope, CoreBindings} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/extension-logging';
import {
    RoomRepository,
    OrganizationRepository,
    ChildrenRepository,
    PersonRepository,
    TalkRepository,
    TopicRepository,
    EventRepository,
    LocationRepository
} from '../repositories';
import {repository} from '@loopback/repository';
import {sampleEvent, sampleLocation, sampleOrganization, samplePerson, sampleTalk} from "../seed-data";
import {sampleRoom} from "../seed-data/room";
import {sampleTopic} from "../seed-data/topic";
import {sampleChildren} from "../seed-data/children";
import {sampleParent} from "../seed-data/parent";
import {ParentRepository} from "../repositories/parent.repository";

@bind({scope: BindingScope.TRANSIENT})
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

      @inject(LoggingBindings.WINSTON_LOGGER)
      protected logger: WinstonLogger,
  ) {}

  async createLocation() {
    // Create Locations
      const find = await this.locationRepository.find();
      if(find.length === 0)
        await this.locationRepository.createAll(sampleLocation);
  }
  async createEvent() {
    // Create Events
      const find = await this.eventRepository.find();
      if(find.length === 0)
    await this.eventRepository.createAll(sampleEvent);
  }
  async createOrganization() {
    // Create Organization
      const find = await this.organizationRepository.find();
      if(find.length === 0)
    await this.organizationRepository.createAll(sampleOrganization);
  }
  async createRoom() {
    // Create Room
      const find = await this.roomRepository.find();
      if(find.length === 0)
    await this.roomRepository.createAll(sampleRoom)
  }
  async createPerson() {
    // Create Persons
      const find = await this.personRepository.find();
      if(find.length === 0)
    await this.personRepository.createAll(samplePerson);
  }
  async createTalk() {
    // Create Persons
      const find = await this.talkRepository.find();
      if(find.length === 0)
     await this.talkRepository.createAll(sampleTalk);
  }
  async createTopic() {
      // Create Topic
      const find = await this.topicRepository.find();
      if(find.length === 0)
      await this.topicRepository.createAll(sampleTopic)
  }
  async createChildren() {
      // Create Children
      const find = await this.childrenRepository.find();
      if(find.length === 0)
      await this.childrenRepository.createAll(sampleChildren)
  }
  async createParent() {
      // Create Parent
      const find = await this.parentRepository.find();
      if(find.length === 0)
      await this.parentRepository.createAll(sampleParent)
  }
}
