const service = require('../services/local.service');

const product = require('../package.json').productName;
const version = require('../package.json').version;
const swaggerDocument = require('../swagger.json');

module.exports = function (router, opts, done) {
  router.get('/status', opts, (req, res) => {
    const data = { name: product + ' ' + version, message: 'Healthy' };
    res.send(data);
  });
  router.get('/api-docs', opts, (req, res) => {
    swaggerDocument.host = req.get('host');
    res.send(swaggerDocument);
  });

  router.get('/settings', opts, (req, res) => {
    const data = service.readSettings();
    res.send(data);
  });
  router.put('/settings', opts, (req, res) => {
    service.writeSettings(req.body);
  });

  done();
};
