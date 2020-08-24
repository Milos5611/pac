import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {Person} from '../graphql-types/person/person-type';
import {PersonRepository} from '../repositories';
import {PersonInput} from "../graphql-types/person/person-input";

@resolver(of => Person)
export class PersonResolver {
    constructor(
        @repository('PersonRepository')
        private readonly personRepo: PersonRepository,
    ) {}

    @query(returns => Person, {nullable: true})
    async person(@arg('personId') personId: string) {
        return this.personRepo.getOne(personId);
    }

    @query(returns => [Person])
    async persons(): Promise<Person[]> {
        return this.personRepo.getAll();
    }

    @mutation(returns => Person)
    async addPerson(@arg('person') person: PersonInput): Promise<Person | void> {
        return this.personRepo.add(person);
    }
}
