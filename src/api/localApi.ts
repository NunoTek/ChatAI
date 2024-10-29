import useHttp from './http';
import { env } from 'src/composables/useSettings';

const server = env?.WEB_API_BASE_URL || 'http://localhost:5000/api';

export default class LocalApi {
  public async status() {
    const response = await useHttp(server).get('/status');
    return response.data;
  }

  public async board(params: any) {
    const response = await useHttp(server).get('/board', { params });
    return response.data;
  }

  public async listCategories(params: any) {
    const response = await useHttp(server).get('/categories', { params });
    return response.data;
  }
  public async listCategoriesCharacters(category: any, params: any) {
    const response = await useHttp(server).get(
      `/categories/${category}/characters`,
      { params }
    );
    return response.data;
  }

  public async searchCharacters(params: any) {
    const response = await useHttp(server).get('/characters', { params });
    return response.data;
  }
  public async getCharacterDetails(params: any) {
    const response = await useHttp(server).get('/character', { params });
    return response.data;
  }
  public async saveCharacterDetails(params: any, body: any) {
    const response = await useHttp(server).put('/character', body, { params });
    return response.data;
  }
  public async deleteCharacterDetails(params: any) {
    const response = await useHttp(server).delete('/character', { params });
    return response.data;
  }

  public async listChats(params: any) {
    const response = await useHttp(server).get('/chats', { params });
    return response.data;
  }
  public async getChat(params: any) {
    const response = await useHttp(server).get('/chat', { params });
    return response.data;
  }
  public async saveChat(params: any, body: any) {
    const response = await useHttp(server).post('/chat', body, { params });
    return response.data;
  }

  public async getSettings() {
    const response = await useHttp(server).get('/settings');
    return response.data;
  }
  public async saveSettings(body: any) {
    const response = await useHttp(server).put('/settings', body);
    return response.data;
  }
}
