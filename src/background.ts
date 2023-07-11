import { browser } from 'webextension-polyfill-ts'

const getPlayerKey = (playerName: string) => `player-${playerName}`

const dayInMs = 1000 * 60 * 60 * 24

const isValidCache = (cache: any) => {
  return Boolean(cache) && Date.now() - Number(new Date(cache.date)) < dayInMs
}

const map = new Map()

type ApiResponse = {
  games: number
  name: string
  wins: number
  id?: string
  lastUpdated?: string
}

browser.runtime.onMessage.addListener(async (msg) => {
  const playerName = msg.name
  const cacheKey = getPlayerKey(playerName)

  const cache = (await browser.storage.sync.get(cacheKey))[cacheKey]

  if (cache && isValidCache(cache)) {
    return cache
  }

  if (map.has(cacheKey)) {
    return map.get(cacheKey)
  }

  const request = fetch(
    // TODO use env var
    `https://dcss-db.danila.dev/api/players/${encodeURIComponent(playerName)}?type=minimal`,
    // const request = fetch(`http://localhost:1444/api/players/${playerName}?type=minimal`,
    {
      mode: 'cors',
    },
  )
    .then((res) => {
      if (res.status !== 200 && cache) {
        return cache
      }

      if (res.status === 404) {
        return {
          name: playerName,
          wins: 0,
          games: 0,
        }
      }

      if (res.status !== 200) {
        throw new Error(res.statusText)
      }

      return res.json()
    })
    .then(async (res: ApiResponse) => {
      await browser.storage.sync.set({
        [cacheKey]: {
          ...res,
          date: Date.now(),
        },
      })

      map.delete(cacheKey)

      return res
    })
    .catch((error) => {
      map.delete(cacheKey)

      throw error
    })

  map.set(cacheKey, request)

  return request
})
