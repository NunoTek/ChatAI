const env = require('../../settings.json');
const useHttp = require('../http');

const server = env.SERVER_OPENAI_URL ?? 'https://api.openai.com/v1';
const secretKey = env.SERVER_OPENAI_SECRETKEY ?? null;

const OpenaiApi = class {
  async status() {
    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;
    const response = await useHttp(server).get('/models', { headers });
    return response.data;
  }
  async generateResponse(request, body) {
    const params = { ...request };
    if (!secretKey) {
      return {
        choices: [{ message: { content: 'I am a bot', role: 'system' } }],
      };
    }

    const data = {
      ...body,
      model: 'gpt-4o',
      max_tokens: 220,
      temperature: 0.65,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
      stop: ['You:', '<|endoftext|>'],
    };

    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;

    const response = await useHttp(server).post('/chat/completions', data, {
      headers,
      params,
      timeout: 2 * 60 * 1000,
    });

    return response.data;
  }
};

module.exports = { OpenaiApi };
