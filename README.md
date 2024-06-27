<h1 align="center">Welcome to logger 👋</h1>

![GitHub License](https://img.shields.io/github/license/GloryWong/logger)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/GloryWong/logger)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/GloryWong/logger/release.yml)
![GitHub Release](https://img.shields.io/github/v/release/GloryWong/logger)
![GitHub Release Date](https://img.shields.io/github/release-date/GloryWong/logger)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/GloryWong/logger)
![GitHub watchers](https://img.shields.io/github/watchers/GloryWong/logger)
![GitHub forks](https://img.shields.io/github/forks/GloryWong/logger)
![GitHub Repo stars](https://img.shields.io/github/stars/GloryWong/logger)
![NPM Version](https://img.shields.io/npm/v/%40gloxy%2Flogger)
![NPM Type Definitions](https://img.shields.io/npm/types/%40gloxy%2Flogger)
![NPM Downloads](https://img.shields.io/npm/dw/%40gloxy%2Flogger)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40gloxy%2Flogger)
![Node Current](https://img.shields.io/node/v/%40gloxy%2Flogger)

A [debug](https://github.com/debug-js/debug#readme)-based logger with predefined methods and scope title, available in both browsers and Node.js.

## Install

```bash
npm install @gloxy/logger
# or
yarn add @gloxy/logger
# or
pnpm add @gloxy/logger
```

## Usage

### Enabling and Disabling

The only parameter `name` (e.g., 'myapp'), representing namespace, helps distinguish these logs from other prints.

- To enable the logger: `*` represents all log levels (`debug`, `info`, `warn`, and `error`).

  * In browser: `localStorage.logger = 'myapp:*'`
  * In Node.js: set the environment variable `LOGGER = myapp:* node index.js`

  Specify a level name to enable a single level of logger, e.g, `myapp:info`.

- Disable logger by removing it.

Or enable or disable the logger programmatically

```javascript
import { disable, enable } from '@gloxy/logger'

enable('myapp:*')
disable()
```

### Basic Usage

```javascript
// Instantiate the logger at the beginning of your application.
import { createLogger } from '@gloxy/logger'
const logger = createLogger('myapp')

logger.info('Ball player %s is performing well', 'Mary')
// Outputs: colored `myapp:info Ball player Mary is performing well +0ms`.
```

### Title Scoped Logger

```javascript
// In addition to the basic usage, you can also create title-scoped logger, especially useful for module files

const log = logger('foo')
log.info('Ball player %s is performing well', 'Mary')
// Outputs: colored `myapp:info [foo] Ball player Mary is performing well +0ms`.
```

## Author

👤 **GloryWong**

* Website: https://glorywong.com
* GitHub: [@GloryWong](https://github.com/GloryWong)

## Show Your Support

Give a ⭐️ if this project helped you!
