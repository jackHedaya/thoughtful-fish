import { useEffect, useState } from 'react'

/**
 * A hook to prevent a loading flash for loading states
 * @param milliseconds Milliseconds to load
 */
export default function usePrettyLoading(milliseconds: number) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const s = setTimeout(() => setIsLoading(false), milliseconds)

    return () => clearTimeout(s)
  }, [milliseconds])

  return isLoading
}
