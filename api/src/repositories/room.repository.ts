import {DefaultCrudRepository, HasManyRepositoryFactory, repository, RepositoryBindings} from '@loopback/repository';
import {ConferenceDatasource} from '../datasources';
import {
    bind,
    BindingScope,
    ContextTags,
    inject,
    LifeCycleObserver,
    lifeCycleObserver,
    Getter
} from '@loopback/core';
import {Room} from '../graphql-types/room/room-type';
import {RoomInput} from "../graphql-types/room/room-input";
import {Talk} from "../graphql-types/talk/talk-type";
import {TalkRepository} from "./talk.repository";

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

    public readonly talks: HasManyRepositoryFactory<Talk, typeof Room.prototype.id>;

    constructor(
        @repository.getter('TalkRepository') talkRepositoryGetter: Getter<TalkRepository>,
        @inject('datasources.conference') dataSource: ConferenceDatasource,
    ) {
        super(Room, dataSource);

        this.talks = this.createHasManyRepositoryFactoryFor(
            'talks',
            talkRepositoryGetter,
        );
        this.registerInclusionResolver('talks', this.talks.inclusionResolver);
    }

    async start() {}

    stop() {}

    async getAll() {
        return this.find({
            include: [{relation: "talk"}]
        });
    }

    async getOne(id: string) {
        return this.findById(id, {
            include: [{relation: "talk"}]
        });
    }

    async createRoom(room: RoomInput) {
        return this.create(room);
    }
}
