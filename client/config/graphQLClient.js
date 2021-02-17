import ApolloClient from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import {getPersistedUserToken, config} from './utils';

export default function graphQLClient(token) {
  let requestToken = token || getPersistedUserToken();
  return new ApolloClient({
    link: createUploadLink({
      uri: config.SVELTE_APP_BE_URL,
      headers: {
        Authorization: requestToken,
      },
    }),
    cache: new InMemoryCache(),
  });
}
