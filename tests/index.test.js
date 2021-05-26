require('jest-fetch-mock').enableMocks()

const nock = require('nock')
const truID = require('../dist/tru-id-sdk.cjs')

const baseUrl = 'https://eu.api.tru.id'

const testUrl = `${baseUrl}/phone_check/v0.1/checks/12345/redirect`

describe('WEB SDK', () => {
  beforeEach(() => {
    nock.restore()
  })

  test('throw an error if no url is passed', async () => {
    expect(truID.openCheckUrl()).rejects.toThrow()
  })

  test.only('iframe is added to the DOM', async () => {
    const coverage = nock(baseUrl)
      .get('/public/coverage/v0.1/device_ip')
      .reply(200, {})
    const redirect = nock(baseUrl)
      .get('/phone_check/v0.1/checks/12345/redirect')
      .delay(2000)
      .reply(200)
    console.log('before')
    await truID.openCheckUrl(testUrl)
    console.log('after')
    expect(coverage.isDone()).toBe(true)
    console.log(document.body.children[0].tagName)
    expect(document.body.children[0].tagName).toBe('IFRAME')
    expect(redirect.isDone()).toBe(true)
  })

  // test('iframe `src` is set', async () => {
  //   const scope = nock(baseUrl)
  //     .get('/public/coverage/v0.1/device_ip')
  //     .reply(200, {})
  //   const expectedSrc = truID._createIFrameSrc(testUrl)
  //   await truID.openCheckUrl(testUrl)
  //   expect(document.body.children[0].src).toBe(expectedSrc)
  //   expect(scope.isDone()).toBe(true)
  // })

  // test('throw an error if device coverage returns 400', async () => {
  //   const scope = nock(baseUrl)
  //     .get('/public/coverage/v0.1/device_ip')
  //     .reply(400, { detail: 'MNO not supported' })
  //   try {
  //     await truID.openCheckUrl(testUrl)
  //   } catch (e) {
  //     expect(e).toMatch('MNO not supported')
  //     expect(scope.isDone()).toBe(true)
  //   }
  // })
})
