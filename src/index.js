function _createIFrameSrc(checkUrl, config = { debug: false }) {
  const html = `
		<body><script>
		const debug = ${config.debug}
		const img = new Image()
		img.style.height = 0
		img.style.width = 0
		img.setAttribute('referrerpolicy', 'no-referrer')
		img.src = "${checkUrl}"

    console.log('HELLO IFRAME')
	
		function handleEndEvent() {
			if(debug) {
				console.log('image loaded')
			}
			window.parent.postMessage({check_url: "${checkUrl}"}, "${window.origin}")
		}
	
		img.onload = handleEndEvent
		img.onerror = handleEndEvent
		document.body.appendChild(img)
		</script></body>
		`
  const src = `data:text/html;charset=utf-8,${encodeURI(html)}`
  return src
}

/**
 * Opens the provide `checkUrl` in order to perform the PhoneCheck.
 *
 * A PhoneCheck is a test if the current device has authenticated with the mobile carrier using the expected IMSI (SIM Card) and MSISDN (Phone Number).
 *
 * @param {String} checkUrl The tru.ID `check_url` to be requested over the mobile data network as part of the verification workflow.
 * @param {Object} config
 * @param {String} config.checkMethod When set to `image` the library will load the `check_url` using a zero pixel image loaded within an <iframe>. When set to `window` the check_url will briefly launch a window that will then be closed.
 * @param {Number} config.windowCloseTimeout The timeout period in milliseconds where the window is closed if `config.checkMethod` is set to `window`. Defaults to 3000 milliseconds.
 * @param {Boolean} config.force It will not try to check the device IP against the coverage API.
 * @param {Boolean} config.debug It will console log more debug info.
 */
async function openCheckUrl(checkUrl, customConfig) {
  const defaultConfig = {
    checkMethod: 'image',
    debug: false,
    force: false,
    windowCloseTimeout: 3000,
  }
  const config = Object.assign(defaultConfig, customConfig)

  function log(...args) {
    if (config.debug) {
      console.log.apply(null, ...args)
    }
  }

  log('tru.ID:phoneCheck')
  if (!checkUrl) {
    throw new Error('tru.ID:phoneCheck: checkUrl is required')
  }

  const url = new URL(checkUrl)
  const apiBaseUrl = url.origin

  // Check device coverage
  // unless the user is passing force:true to skip the check
  if (!config.force) {
    console.log('url', `${apiBaseUrl}/public/coverage/v0.1/device_ip`)
    console.log('HELLO1')
    const res = await fetch(`${apiBaseUrl}/public/coverage/v0.1/device_ip`)
    console.log(res)
    if (res.status === 400 || res.status === 412) {
      // 400 MNO not supported
      // 412 Not a mobile IP
      const json = await res.json()
      throw new Error(json.detail)
    } else if (!res.ok) {
      throw new Error('There was an error checking the device coverage')
    }
  }

  console.log('HELLO2')

  return new Promise((resolve) => {
    if (config.checkMethod === 'image') {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts')
      iframe.src = _createIFrameSrc(checkUrl)

      console.log('checkUrl', checkUrl)

      const handleIFrameMessage = (event) => {
        log(event)
        if (event.data.check_url === checkUrl) {
          window.removeEventListener('message', handleIFrameMessage)
          document.body.removeChild(iframe)
          console.log('FINISHED')
          resolve()
        }
      }
      window.addEventListener('message', handleIFrameMessage)

      document.body.appendChild(iframe)
      console.log('iframe appended')
    } else {
      const win = window.open(checkUrl)
      setTimeout(() => {
        win.close()
        resolve()
      }, config.windowCloseTimeout)
    }
  })
}

export default {
  openCheckUrl,
  _createIFrameSrc,
}
