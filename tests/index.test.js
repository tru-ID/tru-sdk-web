require('jest-fetch-mock')

const nock = require('nock')
const truID = require('../dist/tru-id-sdk.cjs')

const baseUrl = 'https://eu.api.tru.id'

const testUrl = `${baseUrl}/phone_check/v0.1/checks/12345/redirect`

describe('WEB SDK', () => {
  afterAll(nock.restore)
  afterEach(nock.cleanAll)

  test('throw an error if no url is passed', async () => {
    expect(truID.openCheckUrl()).rejects.toThrow()
  })

  test('phone check is successful', async () => {
    const coverage = nock(baseUrl)
      .get('/public/coverage/v0.1/device_ip')
      .reply(200, {})
    const redirect = nock(baseUrl)
      .get('/phone_check/v0.1/checks/12345/redirect')
      .replyWithFile(200, 'tests/logo.svg', {
        'Content-Type': 'image/svg+xml',
      })
    await truID.openCheckUrl(testUrl)
    expect(coverage.isDone()).toBe(true)
    expect(redirect.isDone()).toBe(true)
  })

  test('should not to call the checkUrl when MNO not supported', async () => {
    const coverage = nock(baseUrl)
      .get('/public/coverage/v0.1/device_ip')
      .reply(400, {
        detail: 'MNO not supported',
      })
    const redirect = nock(baseUrl)
      .get('/phone_check/v0.1/checks/12345/redirect')
      .replyWithFile(200, 'tests/logo.svg', {
        'Content-Type': 'image/svg+xml',
      })
    await expect(truID.openCheckUrl(testUrl)).rejects.toThrow(
      'MNO not supported',
    )
    expect(coverage.isDone()).toBe(true)
    // check url never called
    expect(redirect.isDone()).toBe(false)
  })

  test('should not call the checkUrl when not mobile IP ', async () => {
    const coverage = nock(baseUrl)
      .get('/public/coverage/v0.1/device_ip')
      .reply(412, {
        detail: 'Not mobile IP',
      })
    const redirect = nock(baseUrl)
      .get('/phone_check/v0.1/checks/12345/redirect')
      .replyWithFile(200, 'tests/logo.svg', {
        'Content-Type': 'image/svg+xml',
      })
    await expect(truID.openCheckUrl(testUrl)).rejects.toThrow('Not mobile IP')
    expect(coverage.isDone()).toBe(true)
    // check url never called
    expect(redirect.isDone()).toBe(false)
  })

  test('should not proceed when "checkDeviceCoverage: false" is passed', async () => {
    const coverage = nock(baseUrl)
      .get('/public/coverage/v0.1/device_ip')
      .reply(412, {
        detail: 'Not mobile IP',
      })
    const redirect = nock(baseUrl)
      .get('/phone_check/v0.1/checks/12345/redirect')
      .replyWithFile(200, 'tests/logo.svg', {
        'Content-Type': 'image/svg+xml',
      })
    await truID.openCheckUrl(testUrl, {
      checkDeviceCoverage: false,
    })
    // device coverage url is never called
    expect(coverage.isDone()).toBe(false)
    // check url is called
    expect(redirect.isDone()).toBe(true)
  })
})
