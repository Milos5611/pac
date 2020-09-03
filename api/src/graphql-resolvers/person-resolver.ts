import {arg, mutation, query, resolver} from '../../module/graphql';
import {repository} from '@loopback/repository';
import {Person} from '../graphql-types/person/person-type';
import {PersonRepository} from '../repositories';
import {PersonInput} from "../graphql-types/person/person-input";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper/types";
import {parseToken} from "../helper/util";

@resolver(of => Person)
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
    async createPerson(
        @arg('person') person: PersonInput,
        @Ctx() context: ContextTypes
    ): Promise<Person | Error> {
        const user = await parseToken(context.req.headers);
        if(user) {
            return this.personRepo.createPerson(person);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
