import {field, inputType} from '../../../graphql';
import {Language} from './language-type';

@inputType()
export class LanguageInput implements Partial<Language> {
  @field({description: 'Language ID'})
  id: string;

  @field()
  name: string;

  async getId() {}

  async getIdObject() {}

  async toJSON() {}

  async toObject() {}
}
