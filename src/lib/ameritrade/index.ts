import a from 'axios'
import q from 'querystring'

import formatSymbols from './formatSymbols'

const axios = a.create({
  baseURL: 'https://api.ameritrade.com/v1',
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
})

const bearerHeader = (token: string) => ({ Authorization: `Bearer ${token}` })

/*
 *  Functions for Authentication
 */

function tokenRequest(body: { [key: string]: string }) {
  return axios({
    url: '/oauth2/token',
    method: 'POST',
    data: q.stringify({ client_id: process.env.CONSUMER_KEY, ...body }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then((res) => {
    if (res.data.error) throw res.data.error
    return res.data
  })
}

function generateLoginLink() {
  return `https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=${q.escape(
    process.env.REDIRECT_URI
  )}&client_id=${q.escape(process.env.CONSUMER_KEY)}`
}

function requestAccessToken({ refreshToken }: { refreshToken: string }) {
  return tokenRequest({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }).then((data) => {
    const { access_token, expires_in } = data

    return { accessToken: access_token, expiresIn: expires_in }
  })
}

function authenticateViaCode({ code }: { code: string }) {
  return tokenRequest({
    code: code,
    grant_type: 'authorization_code',
    access_type: 'offline',
    redirect_uri: process.env.REDIRECT_URI,
  }).then((data) => ({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    refreshTokenExpiresIn: data.refresh_token_expires_in,
  }))
}

/*
 *  Function to access profile
 */

function getProfile({ accessToken }: { accessToken: string }): Promise<Profile> {
  return axios({
    url: '/userprincipals',
    headers: bearerHeader(accessToken),
  }).then((res) => {
    if (res.data.error) throw res.data.error

    const { userId, primaryAccountId, accounts: fullAccounts } = res.data as UserPrincipal

    const accounts = fullAccounts.map(({ accountId, displayName }) => ({
      accountId,
      displayName,
    }))

    return { userId, primaryAccountId, accounts }
  })
}

/*
 *  Functions to quotes options and stocks
 */

type QuoteParams = { symbol: string; accessToken: string }

type Quote = EquityQuote | OptionQuote | IndexQuote

function quote(params: QuoteParams): Promise<Quote> {
  const { symbol, accessToken } = params

  return axios({
    method: 'GET',
    url: `/marketdata/${symbol}/quotes`,
    headers: bearerHeader(accessToken),
  }).then((res) => res.data[symbol])
}

type GetOptionChainParams = {
  symbol: string
  accessToken: string
  type: 'CALL' | 'PUT' | 'ALL'
}

function getOptionChain(params: GetOptionChainParams) {
  const { symbol, accessToken, type } = params

  return axios({
    method: 'GET',
    url: `/marketdata/chains?${q.encode({
      symbol,
      type,
      includeQuotes: 'TRUE',
    })}`,
    headers: bearerHeader(accessToken),
  })
}

/*
 * Functions to interact with watchlists
 */

type GetAccountWatchlistsParams = { accountNumber: string; accessToken: string }

function getAccountWatchlists(params: GetAccountWatchlistsParams) {
  const { accountNumber, accessToken } = params

  return axios({
    url: `/accounts/${accountNumber}/watchlists`,
    headers: bearerHeader(accessToken),
  }).then((res) => res.data as Watchlist[])
}

type GetWatchlistByNameParams = {
  name: string
  accountNumber: string
  accessToken: string
}

async function getWatchlistByName(params: GetWatchlistByNameParams) {
  const { name, accountNumber, accessToken } = params

  const watchlists = await getAccountWatchlists({ accountNumber, accessToken })

  return watchlists.find(
    (_watchlist) => _watchlist.name.trim().toLowerCase() === name.trim().toLowerCase()
  )
}

type CreateWatchlistParams = {
  name: string
  accessToken: string
  accountNumber: string
  symbols: string[]
}

function createWatchlist(params: CreateWatchlistParams) {
  const { name, accessToken, accountNumber, symbols } = params

  return axios({
    method: 'POST',
    url: `/accounts/${accountNumber}/watchlists`,
    headers: {
      ...bearerHeader(accessToken),
      'Content-Type': 'application/json',
    },
    data: {
      name,
      watchlistItems: formatSymbols(symbols),
    },
  })
}

type UpdateWatchlistParams = {
  watchlistId: string
  watchlistName: string
  accessToken: string
  accountNumber: string
  symbols: string[]
}

function updateWatchlist(params: UpdateWatchlistParams) {
  const { watchlistId, watchlistName, accessToken, accountNumber, symbols } = params

  return axios({
    method: 'PATCH',
    url: `/accounts/${accountNumber}/watchlists/${watchlistId}`,
    headers: bearerHeader(accessToken),
    data: {
      name: watchlistName,
      watchlistId,
      watchlistItems: formatSymbols(symbols),
    },
  })
}

const ameritrade = {
  symbol: { quote, getOptionChain },
  watchlist: {
    getAll: getAccountWatchlists,
    getByName: getWatchlistByName,
    create: createWatchlist,
    update: updateWatchlist,
  },
  auth: {
    authenticateViaCode,
    requestAccessToken,
    generateLoginLink,
  },
  account: {
    getProfile,
  },
}

export default ameritrade
