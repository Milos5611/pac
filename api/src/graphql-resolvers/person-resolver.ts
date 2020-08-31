import {arg, mutation, query, resolver} from '../../graphql/server';
import {repository} from '@loopback/repository';
import {Person} from '../graphql-types/person/person-type';
import {PersonRepository} from '../repositories';
import {PersonInput} from "../graphql-types/person/person-input";

@resolver(() => Person)
export class PersonResolver {
    constructor(
        @repository('PersonRepository')
        private readonly personRepo: PersonRepository,
    ) {}

    @query(() => Person, {nullable: true})
    async person(@arg('personId') personId: string) {
        return this.personRepo.getOne(personId);
    }

    @query(() => [Person])
    async persons(): Promise<Person[]> {
        return this.personRepo.getAll();
    }

    @mutation(() => Person)
    async createPerson(@arg('person') person: PersonInput): Promise<Person | void> {
        return this.personRepo.createPerson(person);
    }
}
