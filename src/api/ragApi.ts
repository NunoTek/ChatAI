import useHttp from './http';
import { env } from 'src/composables/useSettings';

const server = env?.WEB_API_BASE_URL || 'http://localhost:5000/api';
const timeout = 10 * 60 * 1000;

export default class ragApi {
  public async generateStatus() {
    const response = await useHttp(server).get('/generateStatus');
    return response.data;
  }
  public async generateResponse(params: any, body: any) {
    const response = await useHttp(server).post('/generateResponse', body, {
      params,
      timeout: timeout,
    });
    return response.data;
  }
  public async generateImage(params: any, body: any) {
    const response = await useHttp(server).post('/generateImage', body, {
      params,
      responseType: 'blob',
      timeout: timeout,
    });
    return response.data;
  }
  public async generateAudio(params: any, body: any) {
    const response = await useHttp(server).post('/generateAudio', body, {
      params,
      timeout: timeout,
    });
    return response.data;
  }
  public async speechRecognition(params: any, body: any) {
    const response = await useHttp(server).post('/speechRecognition', body, {
      params,
      timeout: timeout,
    });
    return response.data;
  }
}
