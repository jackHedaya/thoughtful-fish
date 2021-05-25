export default function chunk<T>(arr: T[], chunkSize: number) {
  if (chunkSize <= 0) throw 'Invalid chunk size'
  const out: T[][] = []

  for (let i = 0, len = arr.length; i < len; i += chunkSize) out.push(arr.slice(i, i + chunkSize))
  return out
}
