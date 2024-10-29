const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/index.route.js',
  './routes/tavernAI.route.js',
  './routes/adapterAI.route.js',
];

swaggerAutogen(outputFile, endpointsFiles);
