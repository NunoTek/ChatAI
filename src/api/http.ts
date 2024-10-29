import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

const useHttp = (base_url: string): AxiosInstance => {
  const httpClient = axios.create({
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    },
    baseURL: base_url,
  });

  return httpClient;
};

export default useHttp;
