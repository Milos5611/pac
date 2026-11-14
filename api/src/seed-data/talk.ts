import {Talk} from '../graphql-types/talk/talk-type';

const talk = (
  id: string,
  title: string,
  level: string,
  duration: number,
  roomId: string,
): Partial<Talk> => ({id, title, level, duration, language: 'English', roomId});

export const sampleTalk: Partial<Talk>[] = [
  talk('1', 'Scaling event platforms under peak load', 'Senior', 45, '1'),
  talk('2', 'GraphQL for beginners', 'Junior', 30, '3'),
  talk('3', 'Designing APIs for many frontends', 'Intermediate', 40, '2'),
  talk('4', 'Kubernetes in production', 'Senior', 45, '7'),
  talk('5', 'Monitoring that finds bottlenecks early', 'Intermediate', 35, '3'),
  talk('6', 'Infrastructure as code with Terraform', 'Senior', 40, '9'),
  talk('7', 'Your first Svelte app', 'Junior', 25, '7'),
  talk('8', 'Securing SPAs with OpenID Connect', 'Intermediate', 30, '1'),
  talk('9', 'Postgres basics for developers', 'Junior', 30, '4'),
  talk(
    '10',
    'Going paperless: digitising conferences',
    'Intermediate',
    20,
    '5',
  ),
  talk('11', 'TypeScript on the backend', 'Intermediate', 35, '6'),
];
