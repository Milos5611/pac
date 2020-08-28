import {arg, mutation, query, resolver} from '../../graphql';
import {repository} from '@loopback/repository';
import {ChildrenRepository} from "../repositories";
import {Children} from "../graphql-types/children/children-type";
import {ChildrenInput} from "../graphql-types/children/children-input";

@resolver(of => Children)
export class ChildrenResolver {
    constructor(
        @repository('ChildrenRepository')
        private readonly childrenRepository: ChildrenRepository
    ) {}

    @query(returns => Children, {nullable: true})
    async children(@arg('id') id: string) {
        return this.childrenRepository.getOne(id);
    }

    @query(returns => [Children])
    async childrens(): Promise<Children[]> {
        return this.childrenRepository.getAll();
    }

    @mutation(returns => Children)
    async createChildren(
        @arg('children') children: ChildrenInput,
    ): Promise<Children> {
        return this.childrenRepository.createChildren(children);
    }

    @mutation(returns => Children)
    async updateChildren(@arg('id') id: string,  @arg('children') children: ChildrenInput): Promise<Children> {
        return this.childrenRepository.updateChildren(id, children);
    }
}
