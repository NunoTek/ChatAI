import { QNotifyCreateOptions, Notify } from 'quasar';

export default function useNotification() {
  const getCommonConfig = (
    config?: NotificationsOptions | string
  ): QNotifyCreateOptions => {
    if (typeof config == 'string') {
      config = { message: config };
    }

    return {
      message: config?.message,
      html: config?.html ?? false,
      progress: config?.progress ?? false,
      timeout: config?.timeout ?? 2000,
      textColor: 'white',
      position: 'top-right',
      classes: 'q-mt-xl',
    };
  };

  const success = (config?: NotificationsOptions | string) => {
    console.debug(config);

    Notify.create({
      ...getCommonConfig(config),
      icon: 'done',
      color: 'positive',
    });
  };

  const error = (config?: NotificationsOptions | string) => {
    console.error(config);

    Notify.create({
      ...getCommonConfig(config),
      timeout: 5000,
      icon: 'error',
      color: 'negative',
    });
  };

  const warning = (config?: NotificationsOptions | string) => {
    console.warn(config);

    Notify.create({
      ...getCommonConfig(config),
      icon: 'warning',
      color: 'warning',
    });
  };

  const info = (config?: NotificationsOptions | string) => {
    console.info(config);

    Notify.create({ ...getCommonConfig(config), icon: 'info', color: 'info' });
  };

  return {
    success,
    error,
    warning,
    info,
  };
}

export interface NotificationsOptions {
  color?: string;
  position?: string;
  textColor?: string;
  message?: string;
  html?: boolean;
  error?: unknown;
  icon?: string;
  timeout?: number;
  progress?: boolean;
  classes?: string;
}
