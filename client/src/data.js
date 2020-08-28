import { gql } from "apollo-boost";
export const QUERY = gql`
  query Events() {
      events {
        id
        name
      }
    }
  }
`;
