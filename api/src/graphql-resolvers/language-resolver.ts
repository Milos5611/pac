// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {Language} from '../graphql-types/language/language-type';
import {LanguageRepository} from '../repositories';
import {LanguageInput} from "../graphql-types/language/language-input";

@resolver(of => Language)
export class LanguageResolver {
    constructor(
        @repository('LanguageRepository')
        private readonly languageRepo: LanguageRepository,
    ) {}

    @query(returns => Language, {nullable: true})
    async language(@arg('languageId') languageId: string) {
        return this.languageRepo.getOne(languageId);
    }

    @query(returns => [Language])
    async languages(): Promise<Language[]> {
        return this.languageRepo.getAll();
    }

    @mutation(returns => Language)
    async addLanguage(@arg('language') language: LanguageInput): Promise<Language | void> {
        return this.languageRepo.add(language);
    }
}
