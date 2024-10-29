const axios = require('axios');
const qs = require('qs');

const useHttp = (base_url) => {
  const httpClient = axios.create({
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    },
    baseURL: base_url,
  });

  return httpClient;
};

module.exports = useHttp;
