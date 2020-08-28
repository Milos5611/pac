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
import {plainToClass} from "class-transformer";
import {v4 as uuidv4} from 'uuid'
import {Children} from "../graphql-types/children/children-type";
import {ChildrenInput} from "../graphql-types/children/children-input";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class ChildrenRepository
  extends DefaultCrudRepository<Children, typeof Children.prototype.id> implements LifeCycleObserver {

  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
  ) {
    super(Children, dataSource);
  }

  async start() {}

  stop() {}

  async getAll() {
    return this.find();
  }


  async getOne(id: string) {
    return this.findById(id);
  }


  async createChildren(childrenData: ChildrenInput) {
    const newChildren = Object.assign(childrenData, {id: uuidv4()});
    /*const locRepo = await this.getLocationRepository();
    const {name} = await locRepo.findById(eventData.locationId);*/

    const children = plainToClass(Children, newChildren);

    return this.create(children);
  }

  async updateChildren(id: string, childrenData: ChildrenInput) {
    const found = await this.findById(id);
    if(!found) throw new Error("Event doesn't exist");
    await this.updateById(id, childrenData);
    return this.findById(id);
  }
}
