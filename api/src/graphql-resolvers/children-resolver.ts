import {repository} from '@loopback/repository';
import {ChildrenRepository} from "../repositories";
import {Children} from "../graphql-types/children/children-type";
import {ChildrenInput} from "../graphql-types/children/children-input";
import {arg, mutation, query, resolver} from "@loopback/graphql";

@resolver(of => Children)
export class ChildrenResolver {
    constructor(
        @repository('ChildrenRepository')
        private readonly childrenRepository: ChildrenRepository
    ) {}

    @query(() => Children, {nullable: true})
    async children(@arg('id') id: string) {
        return this.childrenRepository.getOne(id);
    }

    @query(() => [Children])
    async childrens(): Promise<Children[]> {
        return this.childrenRepository.getAll();
    }

    @mutation(() => Children)
    async createChildren(
        @arg('children') children: ChildrenInput,
    ): Promise<Children> {
        return this.childrenRepository.createChildren(children);
    }

    @mutation(() => Children)
    async updateChildren(@arg('id') id: string,  @arg('children') children: ChildrenInput): Promise<Children> {
        return this.childrenRepository.updateChildren(id, children);
    }
}
