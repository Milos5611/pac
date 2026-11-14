import {Request, Response} from '@loopback/rest';

export interface GraphQLContext {
  req: Request;
  res: Response;
}
