/**
 * A Set that is dynamic in its ability to compare two objects
 */
export default class GeneralSet<E> {
  private map: Map<string, E>
  private generateUnique: (i: E) => string

  /**
   *
   * @param generateUnique A function to convert an object to a unique string
   */
  constructor(generateUnique: (i: E) => string) {
    this.map = new Map()
    this[Symbol.iterator] = this.values

    this.generateUnique = generateUnique
  }

  add(...items: E[]) {
    items.map((item) => this.map.set(this.generateUnique(item), item))
  }

  values() {
    return this.map.values()
  }

  delete(item: E) {
    return this.map.delete(this.generateUnique(item))
  }

  clear() {
    this.map.clear()
  }

  toArray() {
    return Array.from(this.values())
  }
}
