import { NextApiResponse } from 'next'
import { parseCookies, setCookie } from 'nookies'
import jwt from 'jsonwebtoken'

import { isNextPageContext } from '../../types/assertions'

declare module 'http' {
  interface IncomingMessage {
    _cookies?: { [key: string]: string }
  }
}

type DecodedCookie = { [key: string]: unknown }

const JWT_SECRET = process.env.JWT_SECRET

type WriteAccessParams = { res: NextApiResponse; accessToken: string; expiresIn: number }

export function writeAccessToken(params: WriteAccessParams) {
  const { res, accessToken, expiresIn } = params

  return writeToken({ res, key: 'accessToken', token: accessToken, expiresIn })
}

type WriteRefreshParams = { res: NextApiResponse; refreshToken: string; expiresIn: number }

export function writeRefreshToken(params: WriteRefreshParams) {
  const { res, refreshToken, expiresIn } = params

  return writeToken({
    res,
    key: 'refreshToken',
    token: refreshToken,
    expiresIn,
  })
}

type WriteProfileParams = { res: NextApiResponse; profile: Profile; expiresIn: number }

export function writeProfile(params: WriteProfileParams) {
  const { res, profile, expiresIn } = params

  return writeCookie({ res, key: 'profile', payload: profile, expiresIn })
}

type WriteTokenParams = { res: NextApiResponse; key: string; token: string; expiresIn: number }

function writeToken(params: WriteTokenParams) {
  const { res, key, token, expiresIn } = params

  return writeCookie({ res, key, payload: { token }, expiresIn })
}

type WriteCookieParams = {
  res: NextApiResponse
  key: string
  payload: DecodedCookie
  expiresIn: number
}

function writeCookie(params: WriteCookieParams) {
  const { res, key, payload, expiresIn } = params

  const tokenJwt = jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn,
  })

  setCookie({ res }, key, tokenJwt, {
    httpOnly: true,
    path: '/',
    maxAge: expiresIn,
  })
}

export function getRefreshToken(ctxOrReq: ContextOrRequest) {
  return getToken({ ctxOrReq, key: 'refreshToken' })
}

export function getAccessToken(ctxOrReq: ContextOrRequest) {
  return getToken({ ctxOrReq, key: 'accessToken' })
}

export function getProfile(ctxOrReq: ContextOrRequest) {
  return (getDecodedCookie({ ctxOrReq, key: 'profile' }) as Profile) || null
}

type GetTokenParams = {
  ctxOrReq: ContextOrRequest
  key: string
}

function getToken({ ctxOrReq, key }: GetTokenParams) {
  const token = getDecodedCookie({ ctxOrReq, key })?.token as string

  return token || null
}

function getDecodedCookie({ ctxOrReq, key }: GetTokenParams) {
  try {
    const req = !isNextPageContext(ctxOrReq) ? ctxOrReq : ctxOrReq.req

    // Prevent cookie from being parsed over and over again
    if (!req._cookies) req._cookies = parseCookies({ req })

    const cookieJwt = req._cookies[key]

    return jwt.verify(cookieJwt, JWT_SECRET) as DecodedCookie
  } catch (e) {
    return null
  }
}
