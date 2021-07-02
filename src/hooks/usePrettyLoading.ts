import { useEffect, useState } from 'react'

/**
 * A hook to prevent a loading flash for loading states
 * @param milliseconds Milliseconds to load
 */
export default function usePrettyLoading(isLoading: boolean, milliseconds: number) {
  const [isWaiting, setIsWaiting] = useState(true)

  useEffect(() => {
    const s = setTimeout(() => setIsWaiting(false), milliseconds)

    return () => clearTimeout(s)
  }, [milliseconds])

  return isLoading || isWaiting
}
