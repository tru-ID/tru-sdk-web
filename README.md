# tru.ID SDK for Web Applications

SDK for tru.ID that provides a helper function for requesting the `check_url` for [PhoneCheck](https://tru.id/docs/phone-check) and [SubscriberCheck](https://tru.id/docs/subscriber-check).

With the default `config` the SDK will call our public device coverage API and try to determine if the device is using a mobile IP.

In case the device IP belongs to a MNO we don't support it will throw an error with the message `tru.ID:sdk-web MNO not supported`

In case the device IP is not from a mobile network it will throw an error with the message `tru.ID:sdk-web Not a mobile IP`, in this case the user might be using the wifi with a broadband connection.

If you want to ignore this check you can pass `{ checkDeviceCoverage: false }` in the `config` and proceed regardless.

## Installation

### Via jsDelivr CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@tru_id/tru-sdk-web@canary/dist/tru-id-sdk.umd.js"></script>
```

### Via NPM

```sh
$ npm install @tru_id/tru-sdk-web@canary
```

## Usage

### Via jsDelivr CDN

When installed via a CDN a `tru.ID` global is installed.

```html
<script src="https://cdn.jsdelivr.net/npm/@tru_id/tru-sdk-web@canary/dist/tru-id-sdk.umd.js"></script>
<script>
  tru.ID.openCheckUrl(url, config)
</script>
```

### Via NPM

When installed via NPM the imported object exposes the `openCheckUrl` function.

```js
import truID from '@tru_id/tru-sdk-web'

await truID.openCheckUrl(checkUrl, config)
```

### Config

The `openCheckUrl` function takes an optional `config` Object argument:

```js
truID.openCheckUrl(url, config)
```

The configuration options are:

```js
{
  // whether debug information will be logged to the console.
  // Defaults to `false`
  debug: boolean,

  // "image" - a zero pixel image is dynamically added to the DOM for the check_url request
  // "window" - `window.open` is called to open the check_url in a new window
  // Defaults to "image".
  checkMethod: "image" | "window",

  // If `checkMethod` was set to `window` identifies the number of
  // milliseconds after which the opened window will be closed.
  // Defaults to 3000.
  windowCloseTimeout: Number,

  // It will run the device coverage check to determine
  // if the device is on a mobile IP
  // Defaults to true
  checkDeviceCoverage: boolean
}
```

## Examples

### Via jsDelivr CDN

`https://cdn.jsdelivr.net/npm/@tru_id/tru-sdk-web@canary/dist/tru-id-sdk.umd.js`

```html
<body>
  <form id="phone_check_form">
    <!-- Element to get the user's phone number -->
    <input type="tel" id="phone_number" required />
    <input type="submit" value="Check" />
  </form>

  <script src="https://cdn.jsdelivr.net/npm/@tru_id/tru-sdk-web@canary/dist/tru-id-sdk.umd.js"></script>
  <script>
    async phoneCheck(ev) {
        ev.preventDefault()

        // POST to your own server
        // to create the PhoneCheck resource for the phone number
        const phoneCheckResource = await fetch('/your-server/phone-check', {
            method: 'POST'
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: document.getElementById('phone_number')
            })
        })

        // use the tru.ID web SDK to navigate to the check_url
        try {
          await tru.ID.openCheckUrl(phoneCheckResource.check_url)
        } catch (e) {
          if (e.code === tru.ID.DeviceCoverageErrors.NotMobileIP) {
            // tell the user they should turn off the wifi
            // and use the mobile connection before proceeding
          }
        }
    }

    document.getElementById('phone_check_form')
        .addEventListener('submit', phoneCheck)
  </script>
</body>
```

### Via NPM

```sh
$ npm install @tru_id/tru-sdk-web@canary
```

```js
import truID from '@tru_id/tru-sdk-web'

async function handlePhoneCheckCreation(result) {
  const checkUrl = result.check_url
  await truID.openCheckUrl(checkUrl)
}
```

## Local development

You can run `yarn dev` that will open rollup with watch mode that will re-compile the SDK after every change.

In another terminal you can run `yarn serve` to open a test web page where you can test real phone checks if you have the node server running or you can simply check a PhoneCheck `check_url`.

## Releasing

1. Bump the version if required
2. Run `yarn changelog` to auto-update the `CHANGELOG.md` and manually edit to finesse
3. Commit the changes read for release: `git commit -m 'chore(release): v{version}`
4. Tag the release `git tag v{version}`
5. Push the tags `git push --follow-tags origin main`
6. Publish to NPM `yarn run publish-canary`

## License

[MIT](LICENSE)
