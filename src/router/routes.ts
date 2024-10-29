import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'board',
        path: '',
        component: () => import('pages/BoardPage.vue'),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
      {
        name: 'chats',
        path: 'chats',
        component: () => import('pages/ChatsPage.vue'),
        children: [
          {
            name: 'chat',
            path: ':user_name/:public_id_short',
            component: () => import('pages/ChatPage.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
