import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

type BlastConfig<T> = AxiosRequestConfig & {
  then: (res: AxiosResponse<T>) => PromiseLike<unknown>
  catch: (res: AxiosError<T>) => PromiseLike<unknown>
}

export default function blastFetcher<T>(configs: BlastConfig<T>[]) {
  return Promise.all(configs.map((c) => axios(c).then(c.then).catch(c.catch)))
}
