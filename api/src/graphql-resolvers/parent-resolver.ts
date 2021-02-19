import {repository} from '@loopback/repository';
import {ParentRepository} from "../repositories/parent.repository";
import {Parent} from "../graphql-types/parent/parent-type";
import {ParentInput} from "../graphql-types/parent/parent-input";
import {Ctx} from "type-graphql";
import {ContextTypes} from "../helper";
import SSOOktaStrategy from "../authentication-strategies/sso.okta.strategy";
import {arg, mutation, query, resolver} from "@loopback/graphql";

@resolver(of => Parent)
export class ParentResolver {
    constructor(
        @repository('ParentRepository')
        private readonly parentRepository: ParentRepository
    ) {}

    @query(() => Parent, {nullable: true})
    async parent(@arg('id') id: string) {
        return this.parentRepository.getOne(id);
    }

    @query(() => [Parent])
    async parents(): Promise<Parent[]> {
        return this.parentRepository.getAll();
    }

    @mutation(() => Parent)
    async createParent(
        @arg('parent') parent: ParentInput,
        @Ctx() context: ContextTypes
    ): Promise<Parent | Error> {
        const user = await SSOOktaStrategy.authenticate(context.req);
        if(user) {
            return this.parentRepository.createParent(parent);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }

    @mutation(() => Parent)
    async updateParent(
        @arg('id') id: string,
        @arg('parent') parent: ParentInput,
        @Ctx() context: ContextTypes
    ): Promise<Parent | Error> {
        const user = await SSOOktaStrategy.authenticate(context.req);
        if(user) {
            return this.parentRepository.updateParent(id, parent);
        } else {
            return new Error("You must be logged in to do this action");
        }
    }
}
