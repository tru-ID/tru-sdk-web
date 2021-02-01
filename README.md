# tru.ID SDK for Web Applications

SDK for tru.ID that provides a helper function for requesting the `check_url` for [PhoneCheck](https://tru.id/docs/phone-check) and [SubscriberCheck](https://tru.id/docs/subscriber-check).

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
    // defaults to `false`
    debug: boolean,

    // "image" - a zero pixel image is dynamically added to the DOM for the check_url request
    // "window" - `window.open` is called to open the check_url in a new window
    // defaults to "image".
    checkMethod: "image" | "window", 

    // If `checkMethod` was set to `window` identifies the number of
    // milliseconds after which the opened window will be closed.
    // Defaults to 3000.
    windowCloseTimeout: Number
                                     
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

            // POST to your own server to create the PhoneCheck resource for the phone number
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
            await tru.ID.openCheckUrl(phoneCheckResource.check_url)
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

 ## License

 [MIT](LICENSE)