import { App, DirectiveBinding } from 'vue';

export const BindCanDirective = (app: App<any>) => {
  function setDisableAttribute(el: HTMLElement | Element, hideEl = true) {
    if (hideEl) {
      el.setAttribute('style', 'display:none');
    } else {
      el.setAttribute('readonly', 'true');
      el.setAttribute('disabled', 'true');
      el.setAttribute(
        'style',
        'cursor: not-allowed !important; pointer-events: none !important; opacity: 0.95 !important;'
      );
    }
  }

  app.directive('can', (el, binding: DirectiveBinding, vnode) => {
    const { value } = binding; // v-can:top = binding.arg
    const permissions = null;
    let hide = true;
    if (typeof value == 'string' || Array.isArray(value)) {
      // permissions = store.hasAnyRole(value as string[]);
    } else if (typeof value == 'object') {
      // permissions = store.hasAnyRole(value.roles);
      hide = value.hide;
    }
    if (permissions) {
      return;
    } else {
      setDisableAttribute(el, hide);
    }
  });
};
