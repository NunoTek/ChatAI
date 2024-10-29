const env = require('../settings.json');
const adapter = env.SERVER_ADAPTER ?? 'cloudflareAI';

let adapterAI;
switch (adapter) {
  case 'openAI':
    const { OpenaiApi } = require('../services/adapters/openAI.api');
    adapterAI = new OpenaiApi();
    break;
  case 'cloudflareAI':
    const { CloudflareaiApi } = require('../services/adapters/cloudflareAI.api');
    adapterAI = new CloudflareaiApi();
    break;
  default:
    throw new Error('Invalid adapter');
}

module.exports = function (router, opts, done) {
  router.get('/generateStatus', opts, async (req, res) => {
    const data = await adapterAI.status();
    await res.send(data);
  });
  router.post('/generateResponse', opts, async (req, res) => {
    try {
      const data = await adapterAI.generateResponse(req.query, req.body);
      await res.send(data);
    } catch (error) {
      router.log.error('Error in generateResponse', error);
      throw error;
    }
  });
  router.post('/generateImage', opts, async (req, res) => {
    try {
      const data = await adapterAI.generateImage(req.query, req.body);
      res.type('image/png');
      await res.send(data);
    } catch (error) {
      router.log.error('Error in generateImage', error);
      throw error;
    }
  });
  router.post('/generateAudio', opts, async (req, res) => {
    try {
      const data = await adapterAI.generateAudio(req.query, req.body);
      await res.sendFile(data);
    } catch (error) {
      router.log.error('Error in generateAudio', error);
      throw error;
    }
  });
  router.post('/speechRecognition', opts, async (req, res) => {
    try {
      const data = await adapterAI.speechRecognition(req.query, req.body);
      await res.send(data);
    } catch (error) {
      router.log.error('Error in speechRecognition', error);
      throw error;
    }
  });

  done();
};
