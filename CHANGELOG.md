# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.7](https://github.com/tru-ID/tru-sdk-web/compare/v0.0.5...v0.0.7) (2022-02-16)

* re-publish because of missing `/dist` folder in `0.0.6`

### [0.0.6](https://github.com/tru-ID/tru-sdk-web/compare/v0.0.5...v0.0.6) (2022-01-06)

* re-publish using proper tags
* Updated readme to no longer use `canary`

### [0.0.5](https://github.com/tru-ID/tru-sdk-web/compare/v0.0.4...v0.0.5) (2021-06-10)

* re-publish using proper tags

### 0.0.4 (2021-06-10)


### Bug Fixes

* file extensions for cjs & mjs
* unresolved promise when image loads successfully
* use || instead of ??

### [0.0.3](https://github.com/tru-ID/tru-sdk-web/compare/v0.0.2-canary.1...v0.0.3) (2021-06-07)

- Fix default export

### 0.0.2-canary.0 (2021-06-01)

- Automatically check device coverage to determine if it's not a mobile IP address or not a supported mobile network.
- Added option to bypass this check with `checkDeviceCoverage: false`
- Updated README and packages

### Bug Fixes

- file extensions for cjs & mjs ([5bba996](https://github.com/tru-ID/tru-sdk-web/commit/5bba99671c676cb4710b0c3402f0d411bfc6b860))
- use || instead of ?? ([031057c](https://github.com/tru-ID/tru-sdk-web/commit/031057c198aab39ba0f7bcedca2d23b1fabfd37a))

### [0.0.1-canary.2](https://gitlab.com/4auth/devx/tru-sdk-web/compare/v0.0.1-canary.1...v0.0.1-canary.2) (2021-02-17)

### Bug Fixes

- file extensions for cjs & mjs ([5bba996](https://github.com/4auth/devx/tru-sdk-web/commit/5bba99671c676cb4710b0c3402f0d411bfc6b860))
- use || instead of ?? ([031057c](https://github.com/4auth/devx/tru-sdk-web/commit/031057c198aab39ba0f7bcedca2d23b1fabfd37a))

### [0.0.1-canary.1](https://github.com/4auth/devx/tru-sdk-web/compare/v0.0.1-canary.0...v0.0.1-canary.1) (2021-02-02)

- Updated README with installation and usage instructions

### 0.0.1-canary.0 (2021-02-01)

- Supports installation via CDN and NPM
- Exposes `openCheckUrl(checkUrl, config)`
