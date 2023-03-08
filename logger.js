const pino = require('pino');
const logger = pino({
  level: 'info',
    transport: {
      target: 'pino-pretty'
    }
   },pino.destination('./app.log'))

module.exports = logger;