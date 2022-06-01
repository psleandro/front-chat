import { GraphQLClient } from 'graphql-request';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

export const clientGraph = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_API_GRAPHQL_URL}/graphql`,
  {
    headers: {
      authorization: `Bearer ${cookies['@audio-meet.token']}`,
    },
  }
);
