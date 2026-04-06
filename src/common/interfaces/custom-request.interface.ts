import { Request } from 'express';

export interface ICustomRequest extends Request {
  user: IRequestUser;
}

export interface IRequestUser {
  id: number;
}
