# tru.ID SDK for Web Applications

SDK for tru.ID that provides a helper function for requesting the `check_url` for [PhoneCheck](https://tru.id/docs/phone-check) and [SubscriberCheck](https://tru.id/docs/subscriber-check).

## Usage

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