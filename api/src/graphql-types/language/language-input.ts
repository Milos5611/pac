// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

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
