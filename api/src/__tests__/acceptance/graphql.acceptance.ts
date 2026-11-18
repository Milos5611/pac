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

  describe('write flow (auth disabled)', () => {
    before(() => {
      process.env.AUTH_DISABLED = 'true';
    });
    after(() => {
      delete process.env.AUTH_DISABLED;
    });

    async function mutate<T>(query: string, variables: object): Promise<T> {
      const res = await gql(query, variables);
      expect(res.body.errors).to.be.undefined();
      return res.body.data;
    }

    it('creates, updates and deletes an event with its programme', async () => {
      const {createLocation: location} = await mutate<{
        createLocation: {id: string};
      }>(
        `mutation ($l: LocationInput!) { createLocation(location: $l) { id } }`,
        {l: {name: 'Zagreb'}},
      );
      expect(location.id).to.be.a.String();

      const {createEvent: event} = await mutate<{createEvent: {id: string}}>(
        `mutation ($e: EventInput!) { createEvent(event: $e) { id } }`,
        {
          e: {
            name: 'Test event',
            start_date: '2027-05-01T12:00:00.000Z',
            end_date: '2027-05-02T12:00:00.000Z',
            locationId: location.id,
          },
        },
      );

      await mutate(
        `mutation ($id: String!, $e: EventInput!) { updateEvent(id: $id, event: $e) { id } }`,
        {
          id: event.id,
          e: {
            name: 'Renamed event',
            start_date: '2027-05-01T12:00:00.000Z',
            end_date: '2027-05-03T12:00:00.000Z',
            locationId: location.id,
          },
        },
      );

      const {createRoom: room} = await mutate<{createRoom: {id: string}}>(
        `mutation ($r: RoomInput!) { createRoom(room: $r) { id } }`,
        {r: {name: 'Hall A', locationId: location.id}},
      );
      expect(room.id).to.be.a.String();

      const {createTalk: talk} = await mutate<{createTalk: {id: string}}>(
        `mutation ($t: TalkInput!) { createTalk(talk: $t) { id } }`,
        {
          t: {
            title: 'Hello',
            duration: 30,
            level: 'Junior',
            language: 'English',
            roomId: room.id,
          },
        },
      );

      const {createOrganization: org} = await mutate<{
        createOrganization: {id: string};
      }>(
        `mutation ($o: OrganizationInput!) { createOrganization(organization: $o) { id } }`,
        {o: {name: 'Acme'}},
      );

      const {createPerson: person} = await mutate<{
        createPerson: {id: string};
      }>(`mutation ($p: PersonInput!) { createPerson(person: $p) { id } }`, {
        p: {name: 'Jane Doe', organizationId: org.id, talkId: talk.id},
      });

      const {event: loaded} = await mutate<{
        event: {
          name: string;
          location: {
            rooms: {
              name: string;
              talks: {title: string; persons: {name: string}[]}[];
            }[];
          };
        };
      }>(
        `query ($id: String!) { event(eventId: $id) {
          name location { rooms { name talks { title persons { name } } } }
        } }`,
        {id: event.id},
      );
      expect(loaded.name).to.equal('Renamed event');
      expect(loaded.location.rooms[0].name).to.equal('Hall A');
      expect(loaded.location.rooms[0].talks[0].persons[0].name).to.equal(
        'Jane Doe',
      );

      const {createTopic: topic} = await mutate<{createTopic: {id: string}}>(
        `mutation ($t: TopicInput!) { createTopic(topic: $t) { id } }`,
        {t: {name: 'Forms', talkId: talk.id}},
      );
      expect(topic.id).to.be.a.String();

      const updated = await mutate<{
        updateRoom: {name: string};
        updateTalk: {title: string; duration: number; topics: {name: string}[]};
        updateLocation: {name: string};
        updateOrganization: {name: string};
        updatePerson: {name: string};
      }>(
        `mutation ($room: String!, $talk: String!, $loc: String!, $org: String!, $person: String!,
                   $r: RoomInput!, $t: TalkInput!, $l: LocationInput!, $o: OrganizationInput!, $p: PersonInput!) {
          updateRoom(id: $room, room: $r) { name }
          updateTalk(id: $talk, talk: $t) { title duration topics { name } }
          updateLocation(id: $loc, location: $l) { name }
          updateOrganization(id: $org, organization: $o) { name }
          updatePerson(id: $person, person: $p) { name }
        }`,
        {
          room: room.id,
          talk: talk.id,
          loc: location.id,
          org: org.id,
          person: person.id,
          r: {name: 'Hall B', locationId: location.id},
          t: {
            title: 'Hello again',
            duration: 45,
            level: 'Senior',
            language: 'German',
            roomId: room.id,
          },
          l: {name: 'Zagreb Centre'},
          o: {name: 'Acme Ltd'},
          p: {name: 'Jane Roe', organizationId: org.id, talkId: talk.id},
        },
      );
      expect(updated.updateRoom.name).to.equal('Hall B');
      expect(updated.updateTalk).to.containDeep({
        title: 'Hello again',
        duration: 45,
        topics: [{name: 'Forms'}],
      });
      expect(updated.updateLocation.name).to.equal('Zagreb Centre');
      expect(updated.updateOrganization.name).to.equal('Acme Ltd');
      expect(updated.updatePerson.name).to.equal('Jane Roe');

      await mutate(`mutation ($id: String!) { deleteTopic(id: $id) }`, {
        id: topic.id,
      });
      const {talk: afterDelete} = await mutate<{
        talk: {topics: object[] | null};
      }>(`query ($id: String!) { talk(talkId: $id) { topics { name } } }`, {
        id: talk.id,
      });
      expect(afterDelete.topics ?? []).to.have.length(0);

      const {deleteEvent} = await mutate<{deleteEvent: boolean}>(
        `mutation ($id: String!) { deleteEvent(id: $id) }`,
        {id: event.id},
      );
      expect(deleteEvent).to.be.true();
      const gone = await gql(
        `query ($id: String!) { event(eventId: $id) { id } }`,
        {id: event.id},
      );
      expect(gone.body.errors[0].message).to.match(/not found/i);
    });
  });

  it('serves the GraphQL sandbox on GET', async () => {
    await client.get('/graphql').set('Accept', 'text/html').expect(200);
  });
});
