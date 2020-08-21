import ApolloClient, { gql } from "apollo-boost";
export const QUERY = gql`
  query Events() {
      events2 {
        id
        name
      }
    }
  }
`;
export const client = new ApolloClient({
	uri: "http://localhost:3001/graphql",
});
