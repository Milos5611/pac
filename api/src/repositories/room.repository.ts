import {DefaultCrudRepository, RepositoryBindings} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
    bind,
    BindingScope,
    ContextTags,
    inject,
    LifeCycleObserver,
    lifeCycleObserver,
} from '@loopback/core';
import {Room} from '../graphql-types/room/room-type';
import {RoomInput} from "../graphql-types/room/room-input";

@bind({
    scope: BindingScope.SINGLETON,
    tags: {
        [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
    },
})
@lifeCycleObserver('repository')
export class RoomRepository
    extends DefaultCrudRepository<Room, typeof Room.prototype.id>
    implements LifeCycleObserver {
    constructor(
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Room, dataSource);
    }

    async start() {
        /*await this.createAll(this.sampleLocation);*/
    }

    stop() {}

    async getAll() {
        return this.find();
    }

    async getOne(id: string) {
        return this.findById(id);
    }

    async add(room: RoomInput) {
        return this.create(room);
    }
}
