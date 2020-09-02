import {gql} from "apollo-boost";

export const PERSONS_QUERY = gql`
    query Persons {
        persons {
            id
            name
            organization {
                name
            }
            talk {
                id
                title
                duration
                level
                language
            }
        }
    }
`;

export const PERSON_QUERY = gql`
    query Person($personId: String!) {
        person(personId: $personId) {
            name
            organization {
              name
            }
            talk {
              title   
              duration
              level
              language
            }
        }
    }
`;
