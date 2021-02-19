import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { SWRInfiniteConfigInterface, SWRInfiniteResponseInterface, useSWRInfinite } from 'swr'

export type GetRequest = AxiosRequestConfig | null

interface InfiniteReturn<Data, Error>
  extends Pick<
    SWRInfiniteResponseInterface<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'revalidate' | 'error' | 'mutate' | 'size' | 'setSize'
  > {
  data: Data[] | undefined
  response: AxiosResponse<Data>[] | undefined
}

export interface InfiniteConfig<Data = unknown, Error = unknown>
  extends Omit<SWRInfiniteConfigInterface<AxiosResponse<Data>, AxiosError<Error>>, 'initialData'> {
  initialData?: Data[]
}

export default function useRequestInfinite<Data = unknown, Error = unknown>(
  getRequest: (index: number, previousPageData: AxiosResponse<Data> | null) => GetRequest,
  { initialData, ...config }: InfiniteConfig<Data, Error> = {}
): InfiniteReturn<Data, Error> {
  const { data: response, error, isValidating, revalidate, mutate, size, setSize } = useSWRInfinite<
    AxiosResponse<Data>,
    AxiosError<Error>
  >(
    (index, previousPageData) => {
      const key = getRequest(index, previousPageData)
      return key ? JSON.stringify(key) : null
    },
    (request) => axios(JSON.parse(request)),
    {
      ...config,
      initialData:
        initialData &&
        initialData.map((i) => ({
          status: 200,
          statusText: 'InitialData',
          config: {},
          headers: {},
          data: i,
        })),
    }
  )

  return {
    data: response && response.map((r) => r.data),
    response,
    error,
    isValidating,
    revalidate,
    mutate,
    size,
    setSize,
  }
}
