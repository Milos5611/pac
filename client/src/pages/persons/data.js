export const PERSONS_QUERY = `
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

export const PERSON_QUERY = `
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
