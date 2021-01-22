/**
 * 
 * @param key 
 * @param value 
 * @returns {true | false} Returns true if successful, false if not
 */
export default function setQuerystring(key: string, value: string) {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set(key, value)

    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()
    history.pushState(null, '', newRelativePathQuery)

    return true
  }

  return false
}
