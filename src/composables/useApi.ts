import Api from 'src/api';

export default function useApi() {
  return {
    ...new Api(),
  };
}
