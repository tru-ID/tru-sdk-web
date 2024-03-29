export const DeviceCoverageErrors = {
  UnsupportedMNO: 400,
  NotMobileIP: 412,
}

export function _createIFrameSrc(checkUrl, config = { debug: false }) {
  const html = `
		<body><script>
		const debug = ${config.debug}
		const img = new Image()
		img.style.height = 0
		img.style.width = 0
		img.setAttribute('referrerpolicy', 'no-referrer')
		img.src = "${checkUrl}"
	
		function handleEndEvent() {
			if(debug) {
				console.log('image loaded')
			}
			window.parent.postMessage({ error: false}, "${window.origin}")
		}

        function handleLoadError() {
            if(debug) {
                console.log('error loading image')
            }
            window.parent.postMessage({ error: true }, "${window.origin}")
        }
	
		img.onload = handleEndEvent
		img.onerror = handleLoadError
		document.body.appendChild(img)
		</script></body>
		`
  const src = `data:text/html;charset=utf-8,${encodeURI(html)}`
  return src
}

/**
 * Opens the provided `apiBaseUrl` in order to perform the Reachability check.
 *
 * A Reachability check is a test if the current device's active data connection is one of a mobile carrier, and that this carrier is supported by tru.ID's Phone, Subscriber, and SIM checks.
 *
 * @param {String} apiBaseUrl The tru.ID `base_url` used to communicate with the tru.ID APIs. For example: `https://eu.api.tru.id`.
 * 
 * @return { reachable: Boolean, body: { network_id: String, network_name: String, country_code: String, products: [] }, status: Integer }
 */
export async function getReachability(apiBaseUrl) {
  if (!apiBaseUrl) {
    throw new Error('apiBaseUrl is required')
  }

  const url = new URL(apiBaseUrl)
  const baseUrl = url.origin

  const apiResponse = await fetch(`${baseUrl}/public/coverage/v0.1/device_ip`)
  const responseBody = await apiResponse.json()

  if (apiResponse.status === 200) {
    return { reachable: true, body: responseBody, status: apiResponse.status }
  }

  return { reachable: false, body: responseBody, status: apiResponse.status }
}

/**
 * Opens the provide `checkUrl` in order to perform the PhoneCheck.
 *
 * A PhoneCheck is a test if the current device has authenticated with the mobile carrier using the expected IMSI (SIM Card) and MSISDN (Phone Number).
 *
 * @param {String} checkUrl The tru.ID `check_url` to be requested over the mobile data network as part of the verification workflow.
 * @param {Object} customConfig
 * @param {String} customConfig.checkMethod When set to `image` the library will load the `check_url` using a zero pixel image loaded within an <iframe>. When set to `window` the check_url will briefly launch a window that will then be closed.
 * @param {Number} customConfig.windowCloseTimeout The timeout period in milliseconds where the window is closed if `customConfig.checkMethod` is set to `window`. Defaults to 3000 milliseconds.
 * @param {Boolean} customConfig.checkDeviceCoverage It will not try to check the device IP against the coverage API.
 * @param {Boolean} customConfig.debug It will console log more debug info.
 * @param {String} customConfig.version Based on the PhoneCheck API version to determine the method of flow.
 */
export async function openCheckUrl(checkUrl, customConfig) {
  const defaultConfig = {
    checkMethod: 'image',
    debug: false,
    checkDeviceCoverage: true,
    windowCloseTimeout: 3000,
    version: 'v0.2',
  }

  const config = Object.assign(defaultConfig, customConfig)

  function log(...args) {
    if (config.debug) {
      console.log('tru.ID:sdk-web ', ...args)
    }
  }

  if (!checkUrl) {
    throw new Error('checkUrl is required')
  }

  // Check device coverage
  // unless the user is passing checkDeviceCoverage:false to skip the check
  if (config.checkDeviceCoverage) {
    const coverage = await getReachability(checkUrl)

    if (coverage.status !== 200) {
      const err = new Error(coverage.body)
      err.body = coverage.body
      err.code = coverage.status

      throw err
    }
  }

  return new Promise((resolve, reject) => {
    if (config.version === 'v0.2') {
      window.location = checkUrl

      return
    }

    if (config.checkMethod === 'image') {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts')
      iframe.src = _createIFrameSrc(checkUrl)

      const handleIFrameMessage = (event) => {
        log(`${JSON.stringify(event)}`)
        window.removeEventListener('message', handleIFrameMessage)

        if (event.error) {
          reject(new Error('Error loading invisible image'))
        } else {
          document.body.removeChild(iframe)
          resolve()
        }
      }
      window.addEventListener('message', handleIFrameMessage)

      document.body.appendChild(iframe)
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
  DeviceCoverageErrors,
  openCheckUrl,
  getReachability,
}
