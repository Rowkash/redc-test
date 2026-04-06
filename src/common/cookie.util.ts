import type { Response } from 'express';

export interface ISetCookieParams {
  accessToken: string;
  refreshToken: string;
  res: Response;
}

export const setCookie = (params: ISetCookieParams) => {
  const { accessToken, refreshToken, res } = params;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    domain: 'localhost',
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'lax',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    domain: 'localhost',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'lax',
  });

  return res;
};

export const clearCookie = (res: Response) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    domain: 'localhost',
    secure: true,
    sameSite: 'lax',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    domain: 'localhost',
    secure: true,
    sameSite: 'lax',
  });
};
