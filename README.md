<h1 align="center">Welcome to mini-logger 👋</h1>
<p>
  <a href="https://github.com/GloryWong/mini-logger/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/GloryWong/mini-logger" />
  </a>
</p>

mini-logger a [debug](https://github.com/debug-js/debug#readme) based logger with preset colors, running on both browsers and Node.

## Install

```bash
npm install @gloxy/mini-logger
```

or

```bash
yarn add @gloxy/mini-logger
```

or

```bash
pnpm add @gloxy/mini-logger
```

## Usage

> For all logger methods, the first parameter is a title for it. The second paramter is a formatter, and the rest are any strings one by one  for the formatter.

Activate logger: `*` represents all log types(info, success, warn, error, and debug). You can also specify a type.
* Browser: localStorage.minilogger = 'myapp:*'
* Node: add the env variable MINILOGGER = myapp:*

Deactivate by remove them respectively.

```javascript
// Create the logger instance in the very beginning of your app.
// The name is for the logs being distingushiable from other prints, i.e. myapp
const { createLogger } = require('@gloxy/mini-logger');
const logger = createLogger('myapp');

// Print info
logger('play ball', 'ball player: %s', 'Mary');
logger.info('play ball', 'ball player: %s', 'Mary');

// Print warn
logger.warn('play ball', 'ball player: %s', 'Mary');

// Print success
logger.success('play ball', 'ball player: %s', 'Mary');

// Print error
logger.error('play ball', 'ball player: %s', 'Mary');

// Print debug
logger.debug('play ball', 'ball player: %s', 'Mary');

// Enable or disable logger programmatically
const { enable, disable } = require('@gloxy/mini-logger');
enable('myapp:*');
disable();

```

## Author

👤 **GloryWong**

* Website: https://zhaozhao.today
* GitHub: [@GloryWong](https://github.com/GloryWong)

## Show your support

Give a ⭐️ if this project helped you!
