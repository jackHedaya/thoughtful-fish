import moment from 'moment'

declare global {
  namespace NodeJS {
    interface Global {
      cache: ThoughtfulCache
    }
  }
}

class ThoughtfulCache {
  private cache: { [key: string]: { value: any; expiration: string } } = {}

  constructor() {}

  get(key: string) {
    const cached = this.cache[key]

    if (!cached || this.isExpired(cached.expiration)) return null

    return cached.value
  }

  set(key: string, value: any, expiration?: string) {
    if (this.isExpired(expiration)) throw 'Unable to set expiration to past values'

    this.cache[key] = { value, expiration }
  }

  private isExpired(timestamp: string): boolean {
    if (!timestamp) return false

    return moment(timestamp).isBefore(moment.now())
  }

  tomorrow() {
    return moment().endOf('day').toISOString()
  }

  tomorrowAtNine() {
    return moment().add(1, 'day').set({ hour: 9, minute: 0, second: 0 }).toISOString()
  }

  nextMinute() {
    return moment().add(1, 'minute').toISOString()
  }
}

export default function tcache() {
  if (!global.cache) global.cache = new ThoughtfulCache()

  return global.cache
}