import axios from 'axios';

let env: any = undefined;

const useSettings = async () => {
  try {
    if (!env) {
      const file = '/settings.json';
      const response = await axios.get(file);
      response.data;
      env = response.data;
    }
    return env;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default useSettings;

export { env, useSettings };
