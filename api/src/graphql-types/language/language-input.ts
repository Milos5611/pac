import {field, inputType} from '../../../graphql';
import {Language} from './language-type';

@inputType()
export class LanguageInput implements Partial<Language> {
  @field()
  name: string;
}
