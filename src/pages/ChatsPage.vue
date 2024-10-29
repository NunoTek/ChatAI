<template>
  <q-page class="fit">
    <template v-if="isDesktop">
      <q-splitter v-model="splitterValue" class="fit">
        <template v-slot:before>
          <q-scroll-area
            class="fit relative"
            :horizontal-thumb-style="{ opacity: '0' }"
          >
            <div class="column reverse q-gutter-md q-pa-sm">
              <template v-for="chat in chats" :key="chat.key">
                <chat-card :chat="chat" @click="goToDetails" />
              </template>
            </div>
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <q-scroll-area
            class="fit relative"
            :horizontal-thumb-style="{ opacity: '0' }"
          >
            <router-view :key="$route.fullPath" />
          </q-scroll-area>
        </template>
      </q-splitter>
    </template>
    <template v-else>
      <q-scroll-area
        v-if="showDiscussions"
        class="fit relative"
        :horizontal-thumb-style="{ opacity: '0' }"
      >
        <div class="column reverse q-gutter-md q-pa-md">
          <template v-for="chat in chats" :key="chat.key">
            <chat-card :chat="chat" @click="goToDetails" />
          </template>
        </div>
      </q-scroll-area>

      <q-scroll-area
        v-if="showChat"
        class="fit relative"
        :horizontal-thumb-style="{ opacity: '0' }"
      >
        <router-view :key="$route.fullPath" />
      </q-scroll-area>
    </template>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import useApi from 'src/composables/useApi';
import useScreen from 'src/composables/useScreen';

import ChatCard from 'src/components/ChatCard.vue';

const $q = useQuasar();
const $router = useRouter();
const $api = useApi();
const { isDesktop, isMobile } = useScreen();

const splitterValue = ref(30);

const chats = ref([]);

const showDiscussions = computed(() => {
  return isMobile && $router.currentRoute.value.name === 'chats';
});

const showChat = computed(() => {
  return isMobile && $router.currentRoute.value.name === 'chat';
});

onBeforeMount(async () => {
  init();

  loadChats();
});

const init = () => {
  const screenRatio = $q.screen.lt.sm
    ? 90
    : $q.screen.lt.md
    ? 40
    : $q.screen.lt.lg
    ? 30
    : 20;
  splitterValue.value = screenRatio;
};

const loadChats = async () => {
  const request = $router.currentRoute.value.params;

  const [discussions, chat] = await Promise.all([
    $api.local.listChats(null),
    $api.local.getCharacterDetails(request),
  ]);

  chats.value = discussions ?? [];

  if (chat && !chats.value.some((x: any) => x.key === chat.key)) {
    chats.value.push({
      ...chat,
      lastMessage: chat.lastMessage ?? chat.firstMessage,
    });
  }
};

const goToDetails = (item) => {
  $router.push({
    name: 'chat',
    params: {
      user_name: item.user_name,
      public_id_short: item.public_id_short,
    },
  });
};
</script>

<style lang="scss" scoped></style>
