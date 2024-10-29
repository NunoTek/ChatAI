import { boot } from 'quasar/wrappers';
import useSettings from '../composables/useSettings';

export default boot(async () => {
  await useSettings();
});
