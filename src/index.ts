import debug from 'debug';

const configs = [
  {
    type: 'error',
    consoleMethod: console.error,
    color: '#DC143C',
  },
  {
    type: 'warn',
    consoleMethod: console.warn,
    color: '#FFA500',
  },
  {
    type: 'info',
    consoleMethod: console.info,
    color: '#1E90FF',
  },
  {
    type: 'success',
    consoleMethod: console.log,
    color: '#32CD32',
  },
  {
    type: 'debug',
    consoleMethod: console.debug,
    color: 'gray',
  },
];

function createInternalLogger(
  name: string,
  type: string,
  consoleMethod: (...args: any[]) => any,
  color: string,
) {
  const logger = debug(`${name}:${type}`);
  logger.log = consoleMethod.bind(console);
  logger.color = color;
  return logger;
}

function createLoggerMethods(name: string) {
  return configs.map(
    ({ type, consoleMethod, color }) =>
      (title: string, formatter: any, ...args: any[]) => {
        const logger = createInternalLogger(name, type, consoleMethod, color);
        logger(`[${title}] ${formatter}`, ...args);
      },
  );
}

export type LoggerMethod = ReturnType<typeof createLoggerMethods>[0];

export interface Logger {
  (title: string, formatter: any, ...args: any[]): void;
  info: LoggerMethod;
  warn: LoggerMethod;
  success: LoggerMethod;
  error: LoggerMethod;
  debug: LoggerMethod;
}

function createLogger(name: string) {
  const [error, warn, info, success, debug] = createLoggerMethods(name.trim());
  const logger: Logger = (...args: Parameters<LoggerMethod>) => info(...args);

  logger.info = info;
  logger.warn = warn;
  logger.success = success;
  logger.error = error;
  logger.debug = debug;

  return logger;
}

function enable(namespace: string) {
  return debug.enable(namespace);
}

function disable() {
  return debug.disable();
}

function enableOrDisable(namespace?: string) {
  if (namespace) {
    enable(namespace);
  } else {
    disable();
  }
}

if (window?.localStorage) {
  enableOrDisable(window.localStorage['minilogger']);
}

if (process?.env.MINI_LOGGER) {
  enableOrDisable(process.env.MINILOGGER);
}

export { createLogger, enable, disable };
