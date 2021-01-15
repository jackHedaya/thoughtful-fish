export default function formatSymbols(symbols: string[]) {
  const isOption = (s: string) => /^[A-Z]{1,5}_\d{6}[CP]\d+(\.\d{1,2})?$/.exec(s) !== null

  return symbols.map((symbol) => ({
    instrument: {
      symbol,
      assetType: isOption(symbol) ? 'OPTION' : 'EQUITY',
    },
  }))
}
