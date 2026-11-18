import {expect} from '@loopback/testlab';
import {GraphQLError, GraphQLFormattedError} from 'graphql';
import {createErrorFormatter} from '../../graphql-server/format-error';

describe('GraphQL error formatter', () => {
  const internal: GraphQLFormattedError = {
    message: 'raw message',
    path: ['createTalk'],
    extensions: {code: 'INTERNAL_SERVER_ERROR'},
  };

  function format(original: Error) {
    const logged: string[] = [];
    const formatter = createErrorFormatter(message => logged.push(message));
    const error = new GraphQLError(original.message, {originalError: original});
    return {result: formatter(internal, error), logged};
  }

  it('masks unexpected errors and logs them with the stack', () => {
    const {result, logged} = format(
      new Error('relation "talk" does not exist at /app/dist/x.js'),
    );
    expect(result.message).to.equal('Internal server error');
    expect(result.extensions).to.eql({code: 'INTERNAL_SERVER_ERROR'});
    expect(logged[0]).to.match(/createTalk[\s\S]*relation "talk"/);
  });

  it('maps a Postgres foreign key violation to BAD_USER_INPUT', () => {
    const fk = Object.assign(new Error('violates foreign key constraint'), {
      code: '23503',
    });
    const {result, logged} = format(fk);
    expect(result).to.containDeep({
      message: 'A referenced record does not exist',
      extensions: {code: 'BAD_USER_INPUT'},
    });
    expect(logged).to.be.empty();
  });

  it('maps a LoopBack missing entity to NOT_FOUND', () => {
    const notFound = Object.assign(
      new Error('Entity not found: Talk with id "x"'),
      {code: 'ENTITY_NOT_FOUND'},
    );
    expect(format(notFound).result).to.containDeep({
      message: 'Entity not found: Talk with id "x"',
      extensions: {code: 'NOT_FOUND'},
    });
  });

  it('passes errors with a client-facing code through', () => {
    const formatter = createErrorFormatter(() => {});
    const auth = {message: 'no token', extensions: {code: 'UNAUTHENTICATED'}};
    expect(formatter(auth, new Error('no token'))).to.equal(auth);
  });
});
