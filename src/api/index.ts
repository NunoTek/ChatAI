import localApi from './localApi';
import ragApi from './ragApi';

export default class ApiTypes {
  local: localApi;
  ragApi: ragApi;

  constructor() {
    this.local = new localApi();
    this.ragApi = new ragApi();
  }
}
