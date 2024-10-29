const Fastify = require('fastify');
const helmet = require('@fastify/helmet');
const cors = require('@fastify/cors');

const env = require('./settings.json');

const pino = require('pino');
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Instantiate the framework
const fastify = Fastify({
  logger: logger, //true
  bodyLimit: 10048576,
});

// Register Security
fastify.register(
  helmet,
  { global: true }
  // Example disable the `contentSecurityPolicy` middleware but keeps the rest.
  // { contentSecurityPolicy: false }
);

// Register CORS
fastify.register(cors, {
  origin: '*', //true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  // allowedHeaders: ['content-type', 'accept', 'authorization' ]
});

// Register error handler
fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(500).send({ ok: false });
  } else {
    // fastify will use parent error handler to handle this
    reply.send(error);
  }
});


const path = require('node:path');
// Static files
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/static/', // optional: default '/'
  // constraints: { host: 'example.com' } // optional: default {}
});
// Pwa files
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'web'),
  prefix: '/',
  decorateReply: false,
});

// TODO: fix header for static files
fastify.addHook('onSend', async (request, reply, payload) => {
  reply.header('Content-Security-Policy', '*');
  reply.header('Cross-Origin-Opener-Policy', '*');
  reply.header('Cross-Origin-Resource-Policy', '*');
  return payload;
});

const routes = require('./routes/index.route');
fastify.register(routes, { prefix: '/api' });

const tavernAI = require('./routes/tavernAI.route');
fastify.register(tavernAI, { prefix: '/api' });

const adapterAI = require('./routes/adapterAI.route');
fastify.register(adapterAI, { prefix: '/api' });


// Register not found handler
fastify.setNotFoundHandler(function (req, res) {
  const accept = req.headers['Accept'] || '*';

  if (accept.includes('html') || accept.includes('*')) {
    const fs = require('fs');
    if (fs.existsSync('web/index.html')) {
      res.sendFile('web/index.html');
      return;
    }
  }

  if (accept.includes('json') || accept.includes('*')) {
    res.code(404).send({ error: 'Not found' });
    return;
  }

  res.code(404).type('txt').send('Not found');
});



// Run the server
fastify.listen({ host: env.SERVER_HOST || '0.0.0.0', port: env.SERVER_PORT || 5000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    // process.exit(1)
  }
  // Server is listening at ${address}
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Perform cleanup and exit process if necessary
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Perform cleanup and exit process if necessary
});

module.exports = fastify;
