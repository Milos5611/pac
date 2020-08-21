import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
/*import { getPersistedUserToken } from './utils';*/

export default function graphQLClient(token) {
  /*let requestToken = token || getPersistedUserToken();*/
  return new ApolloClient({
    link: createUploadLink({
      uri: "localhost:3001/graphql",
      /*headers: {
        Authorization: `Bearer ${requestToken}`,
      },*/
    }),
    cache: new InMemoryCache(),
  });
}
