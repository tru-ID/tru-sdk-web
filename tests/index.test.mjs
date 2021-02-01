import truID from '../dist/tru-id-sdk.esm'

const testUrl = 'https://example.com'

test('iframe is added to the DOM', () => {
    truID.openCheckUrl(testUrl)
    expect(document.body.children[0].tagName).toBe('IFRAME')
})

test('iframe `src` is set', () => {
    const expectedSrc = truID._createIFrameSrc(testUrl)
    truID.openCheckUrl(testUrl)
    expect(document.body.children[0].src).toBe(expectedSrc)
})