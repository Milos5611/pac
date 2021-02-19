import {repository} from '@loopback/repository';
import {Person} from '../graphql-types/person/person-type';
import {PersonRepository} from '../repositories';
import {PersonInput} from "../graphql-types/person/person-input";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper";
import SSOOktaStrategy from "../authentication-strategies/sso.okta.strategy";
import {arg, mutation, query, resolver} from "@loopback/graphql";

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
        const user = await SSOOktaStrategy.authenticate(context.req);
        if(user) {
            return this.personRepo.createPerson(person);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
