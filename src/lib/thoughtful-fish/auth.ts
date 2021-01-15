import { NextApiResponse } from 'next'
import { parseCookies, setCookie } from 'nookies'
import jwt from 'jsonwebtoken'
import { isNextPageContext } from '../../types/assertions'

declare module 'http' {
  interface IncomingMessage {
    _cookies?: { [key: string]: string }
  }
}

type DecodedToken = { [key: string]: string }

const JWT_SECRET = process.env.JWT_SECRET

type WriteAccessParams = {
  res: NextApiResponse
  accessToken: string
  expiresIn: number
}

export function writeAccessToken(params: WriteAccessParams) {
  const { res, accessToken, expiresIn } = params

  return writeToken({ res, key: 'accessToken', token: accessToken, expiresIn })
}

type WriteRefreshParams = {
  res: NextApiResponse
  refreshToken: string
  expiresIn: number
}

export function writeRefreshToken(params: WriteRefreshParams) {
  const { res, refreshToken, expiresIn } = params

  return writeToken({
    res,
    key: 'refreshToken',
    token: refreshToken,
    expiresIn,
  })
}

type WriteTokenParams = {
  res: NextApiResponse
  key: string
  token: string
  expiresIn: number
}

function writeToken(params: WriteTokenParams) {
  const { res, key, token, expiresIn } = params

  const tokenJwt = jwt.sign({ token }, JWT_SECRET, {
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

type GetTokenParams = {
  ctxOrReq: ContextOrRequest
  key: string
}

function getToken({ ctxOrReq, key }: GetTokenParams) {
  try {
    const req = !isNextPageContext(ctxOrReq) ? ctxOrReq : ctxOrReq.req

    if (!req._cookies) req._cookies = parseCookies({ req })

    let tokenJwt = req._cookies[key]

    const { token } = jwt.verify(tokenJwt, JWT_SECRET) as DecodedToken

    return token || null
  } catch (e) {
    return null
  }
}
