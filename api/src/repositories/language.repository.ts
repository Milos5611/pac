import {DefaultCrudRepository, RepositoryBindings} from '@loopback/repository';
import {Language} from '../graphql-types/language/language-type';
import {ConferenceDatasource} from '../datasources';
import {
  bind,
  BindingScope,
  ContextTags,
  inject,
  LifeCycleObserver,
  lifeCycleObserver,
} from '@loopback/core';
import {LanguageInput} from "../graphql-types/language/language-input";

@bind({
  scope: BindingScope.SINGLETON,
  tags: {
    [ContextTags.NAMESPACE]: RepositoryBindings.REPOSITORIES
  },
})
@lifeCycleObserver('repository')
export class LanguageRepository
  extends DefaultCrudRepository<Language, typeof Language.prototype.id>
  implements LifeCycleObserver {
  constructor(
      @inject('datasources.conference') dataSource: ConferenceDatasource,
  ) {
    super(Language, dataSource);
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

  async createLanguage(language: LanguageInput) {
    return this.create(language);
  }
}
