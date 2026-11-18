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

export const SPEAKER_OPTIONS_QUERY = `
  query SpeakerOptions {
    organizations {
      id
      name
    }
    talks {
      id
      title
    }
  }
`;

export const CREATE_ORGANIZATION = `
  mutation CreateOrganization($organization: OrganizationInput!) {
    createOrganization(organization: $organization) {
      id
      name
    }
  }
`;

export const CREATE_PERSON = `
  mutation CreatePerson($person: PersonInput!) {
    createPerson(person: $person) {
      id
    }
  }
`;
