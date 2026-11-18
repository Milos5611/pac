import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {ApiApplication} from '../../application';
import {seedDatabase} from '../../seed';

describe('GraphQL API (in-memory database)', () => {
  let app: ApiApplication;
  let client: Client;

  before(async () => {
    process.env.LOG_LEVEL ??= 'error';
    delete process.env.AUTH_DISABLED;
    delete process.env.AUTH0_ISSUER;

    app = new ApiApplication({rest: givenHttpServerConfig()});
    app
      .bind('datasources.config.conference')
      .to({name: 'conference_db', connector: 'memory'});
    await app.boot();
    await app.migrateDataSources();
    await seedDatabase(app);
    await app.start();
    client = createRestAppClient(app);
  });

  after(async () => {
    await app.stop();
  });

  function gql(query: string, variables: object = {}) {
    return client
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({query, variables})
      .expect(200);
  }

  it('lists events with nested location, rooms, talks and topics', async () => {
    const res = await gql(`{
      events { id name location { name rooms { name talks { title topics { name } } } } }
    }`);
    expect(res.body.errors).to.be.undefined();
    expect(res.body.data.events).to.have.length(10);
    const minority = res.body.data.events.find(
      (e: {id: string}) => e.id === 'e6c6d273-b2d3-4bb6-bcc3-aeb4d0611isk',
    );
    expect(minority.location.name).to.equal('Munich');
    expect(minority.location.rooms[0].talks[0].topics).to.have.length(4);
  });

  it('returns one event with topic children and parents', async () => {
    const res = await gql(
      `query Event($eventId: String!) {
        event(eventId: $eventId) {
          location { rooms { talks { topics { name childrens { name } parents { name } } } } }
        }
      }`,
      {eventId: 'e6c6d273-b2d3-4bb6-bcc3-aeb4d06mxksu'},
    );
    expect(res.body.errors).to.be.undefined();
    const topics = res.body.data.event.location.rooms
      .flatMap((r: {talks: object[] | null}) => r.talks ?? [])
      .flatMap((t: {topics: object[] | null}) => t.topics ?? []);
    const graphql = topics.find((t: {name: string}) => t.name === 'GraphQL');
    expect(graphql.childrens).to.have.length(6);
    expect(graphql.parents).to.have.length(5);
  });

  it('lists persons with organization and talk', async () => {
    const res = await gql(
      `{ persons { id name organization { name } talk { title } } }`,
    );
    expect(res.body.errors).to.be.undefined();
    expect(res.body.data.persons).to.have.length(9);
    expect(res.body.data.persons[0].organization.name).to.be.a.String();
  });

  it('lists rooms with their talks', async () => {
    const res = await gql(`{ rooms { name talks { title } } }`);
    expect(res.body.errors).to.be.undefined();
    expect(res.body.data.rooms).to.have.length(9);
  });

  it('rejects mutations without authentication', async () => {
    const res = await gql(
      `mutation { createOrganization(organization: {name: "X"}) { id } }`,
    );
    expect(res.body.errors[0].extensions.code).to.equal('UNAUTHENTICATED');
  });

  it('serves the GraphQL sandbox on GET', async () => {
    await client.get('/graphql').set('Accept', 'text/html').expect(200);
  });
});
