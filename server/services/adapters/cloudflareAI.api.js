const env = require('../../settings.json');
const useHttp = require('../http');

const server =
  env.SERVER_CLOUDFLAREAI_URL ?? 'https://api.cloudflare.com/client/v4';
const secretKey = env.SERVER_CLOUDFLAREAI_SECRETKEY ?? null;

// Models: https://developers.cloudflare.com/workers-ai/models/

const CloudflareaiApi = class {
  async status() {
    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;
    const response = await useHttp(server).get('/user/tokens/verify', {
      headers,
    });
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
    };

    // '@hf/thebloke/openhermes-2.5-mistral-7b-awq'; // '@hf/nousresearch/hermes-2-pro-mistral-7b'; // '@hf/DevsDoCode/LLama-3-8b-Uncensored';
    const model =
      env.SERVER_CLOUDFLAREAI_MODEL ?? '@cf/meta/llama-3-8b-instruct';

    const account = env.SERVER_CLOUDFLAREAI_ACCOUNT ?? null;
    const endpoint_url = `/accounts/${account}/ai/run/${model}`;
    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;

    const response = await useHttp(server).post(endpoint_url, data, {
      headers,
      params,
      timeout: 10 * 60 * 1000,
    });

    const result = {
      choices: [
        {
          message: {
            content: response.data?.result?.response,
            role: 'assistant',
          },
        },
      ],
    };
    return result;
  }
  async generateImage(request, body) {
    const params = { ...request };
    if (!secretKey) {
      return null;
    }

    const data = {
      height: 512,
      width: 512,
      negative_prompt: 'bad quality, bad lightning, bad composition',
      ...body,
    };

    // '@cf/runwayml/stable-diffusion-v1-5-img2img'
    const model =
      env.SERVER_CLOUDFLAREAI_MODEL ?? '@cf/stabilityai/stable-diffusion-xl-base-1.0'; // '@cf/lykon/dreamshaper-8-lcm';
    const account = env.SERVER_CLOUDFLAREAI_ACCOUNT ?? null;
    const endpoint_url = `/accounts/${account}/ai/run/${model}`;
    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;

    const response = await useHttp(server).post(endpoint_url, data, {
      headers,
      params,
      responseType: 'arraybuffer',
      timeout: 10 * 60 * 1000,
    });

    return response.data;
  }
  async generateAudio(request, body) {
    const params = { ...request };
    if (!secretKey) {
      return null;
    }

    const data = {
      ...body,
    };

    const model =
      env.SERVER_CLOUDFLAREAI_MODEL ?? '@hf/WhisperSpeech/WhisperSpeech';
    const account = env.SERVER_CLOUDFLAREAI_ACCOUNT ?? null;
    const endpoint_url = `/accounts/${account}/ai/run/${model}`;
    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;

    const response = await useHttp(server).post(endpoint_url, data, {
      headers,
      params,
      responseType: 'arraybuffer',
      timeout: 10 * 60 * 1000,
    });
    return response.data;
  }
  async speechRecognition(request, body) {
    const params = { ...request };
    if (!secretKey) {
      return null;
    }

    const data = {
      ...body,
    };

    const model = env.SERVER_CLOUDFLAREAI_MODEL ?? '@cf/openai/whisper'; // '@cf/openai/whisper-tiny-en';
    const account = env.SERVER_CLOUDFLAREAI_ACCOUNT ?? null;
    const endpoint_url = `/accounts/${account}/ai/run/${model}`;
    const headers = secretKey ? { Authorization: `Bearer ${secretKey}` } : null;

    const response = await useHttp(server).post(endpoint_url, data, {
      headers,
      params,
      timeout: 10 * 60 * 1000,
    });
    return response.data;
  }
};

module.exports = { CloudflareaiApi };
