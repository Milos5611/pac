// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Binding,
  Context,
  createBindingFromClass,
  inject,
  service,
} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {GraphQLResolveInfo} from 'graphql';
import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
  ResolverData,
  Root,
} from 'type-graphql';
import {LoopBackContainer} from '../..';

describe('LoopBack container for type-graphql', () => {
  let parentCtx: Context;
  let container: LoopBackContainer;
  const resolverData: ResolverData = {
    root: '',
    args: {},
    context: {},
    info: ({} as unknown) as GraphQLResolveInfo,
  };

  beforeEach(givenContainer);

  it('resolves from parent context', () => {
    parentCtx.add(createBindingFromClass(BookService));
    parentCtx.bind('resolvers.BookResolver').toClass(BookResolver);
    const resolver = container.get(BookResolver, resolverData);
    expect(resolver).to.be.instanceof(BookResolver);
  });

  it('resolves from parent context by key', () => {
    parentCtx.add(createBindingFromClass(BookService));
    parentCtx.bind('resolvers.BookResolver').toClass(BookResolver);
    parentCtx.bind('resolvers.AnotherBookResolver').toClass(BookResolver);
    const resolver = container.get(BookResolver, resolverData) as BookResolver;
    expect(resolver.binding.key).to.eql('resolvers.BookResolver');
  });

  it('resolves from child context', () => {
    parentCtx.add(createBindingFromClass(BookService));
    const resolver = container.get(BookResolver, resolverData);
    expect(resolver).to.be.instanceof(BookResolver);
    expect(parentCtx.isBound('resolvers.BookResolver')).to.be.false();
  });

  @ObjectType({description: 'Book'})
  class Book {
    @Field(type => ID)
    id: string;

    @Field()
    title: string;

    @Field(type => Int)
    protected numberInCollection: number;
  }

  class BookService {
    static books: Record<string, Book> = {
      '1': new Book(),
    };
    getOne(id: string) {
      return BookService.books[id];
    }
  }

  @Resolver(of => Book)
  class BookResolver {
    @inject.binding()
    readonly binding: Binding;

    constructor(
      // constructor injection of service
      @service()
      private readonly bookService: BookService,
    ) {}

    @Query(returns => Book, {nullable: true})
    async book(@Arg('bookId') bookId: string) {
      return this.bookService.getOne(bookId);
    }

    @FieldResolver()
    numberInCollection(@Root() book: Book): number {
      return 1;
    }
  }

  function givenContainer() {
    parentCtx = new Context();
    container = new LoopBackContainer(parentCtx);
  }
});
