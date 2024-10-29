import { boot } from 'quasar/wrappers';
import { BindCanDirective } from './directives/can';

export default boot(({ app }) => {
  BindCanDirective(app);
});
