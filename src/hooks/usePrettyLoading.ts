import { useEffect, useState } from 'react'

/**
 * A hook to prevent a loading flash for loading states
 * @param milliseconds Milliseconds to load
 */
export default function usePrettyLoading(isLoading: boolean, milliseconds: number) {
  const [isTimedOut, setIsTimedOut] = useState(true)

  useEffect(() => {
    const s = setTimeout(() => setIsTimedOut(false), milliseconds)

    return () => clearTimeout(s)
  }, [milliseconds])

  return isLoading && isTimedOut
}
