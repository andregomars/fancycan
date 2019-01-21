import CacheLayer from '../src/cache'

/**
 * Dummy test
 */
describe('CacheLayer test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('CacheLayer store and fetch works', () => {
    const cache = CacheLayer.getInstance()
    cache.set<string>('name', 'andre')
    const actual = cache.get<string>('name')
    expect(actual).toEqual('andre')
  })
})
