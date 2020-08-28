import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {ParentRepository} from "../repositories/parent.repository";
import {Parent} from "../graphql-types/parent/parent-type";
import {ParentInput} from "../graphql-types/parent/parent-input";

@resolver(of => Parent)
export class ParentResolver {
    constructor(
        @repository('ParentRepository')
        private readonly parentRepository: ParentRepository
    ) {}

    @query(returns => Parent, {nullable: true})
    async parent(@arg('id') id: string) {
        return this.parentRepository.getOne(id);
    }

    @query(returns => [Parent])
    async parents(): Promise<Parent[]> {
        return this.parentRepository.getAll();
    }

    @mutation(returns => Parent)
    async createParent(
        @arg('parent') parent: ParentInput,
    ): Promise<Parent> {
        return this.parentRepository.createParent(parent);
    }

    @mutation(returns => Parent)
    async updateParent(@arg('id') id: string,  @arg('parent') parent: ParentInput): Promise<Parent> {
        return this.parentRepository.updateParent(id, parent);
    }
}
