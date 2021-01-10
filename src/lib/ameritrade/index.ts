import a from 'axios'
import q from 'querystring'

import formatSymbols from './formatSymbols'

const axios = a.create({
  baseURL: 'https://api.ameritrade.com/v1',
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
})

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
    headers: { Authorization: `Bearer ${accessToken}` },
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
    headers: { Authorization: `Bearer ${accessToken}` },
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
    headers: { Authorization: `Bearer ${accessToken}` },
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
    (_watchlist) =>
      _watchlist.name.trim().toLowerCase() === name.trim().toLowerCase()
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
      Authorization: `Bearer ${accessToken}`,
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
  const {
    watchlistId,
    watchlistName,
    accessToken,
    accountNumber,
    symbols,
  } = params

  return axios({
    method: 'PATCH',
    url: `/accounts/${accountNumber}/watchlists/${watchlistId}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    data: {
      name: watchlistName,
      watchlistId,
      watchlistItems: formatSymbols(symbols),
    },
  })
}

export default {
  symbol: { quote, getOptionChain },
  watchlist: {
    getAll: getAccountWatchlists,
    getByName: getWatchlistByName,
    create: createWatchlist,
    update: updateWatchlist,
  },
}
