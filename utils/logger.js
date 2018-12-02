const getLogger = require('loglevel-colored-level-prefix')

/*
  Logger
    - TRACE (Gray)
      trace(msg)

    - DEBUG (Light Blue)
      debug(msg)

    - INFO  (Blue)
      info(msg)

    - WARN  (Yellow)
      warn(msg)

    - ERROR (Red)
      error(msg)

*/

module.exports = {
  systemLogger: ({ message }) => getLogger({ prefix: '[SYSTEM]', level: 'trace' }).info(`\n${message}\n`),
}
