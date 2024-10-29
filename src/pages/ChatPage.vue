<template>
  <q-page class="fit">
    <q-tab-panels v-model="tab" keep-alive animated swipeable infinite>
      <q-tab-panel name="chat">
        <chat-messages
          ref="chat"
          v-model="messages"
          :current-user="user"
          :character="character"
          :settings="settings"
          :receiver-loading="chatLoading"
          :options="chatOptions"
          @back="back"
          @save-messages="saveChat"
          @send-message="sendMessage"
          @resend-message="resendMessage"
          @delete-message="deleteMessage"
          @request-image="requestImage"
          @request-speech-recognition="requestSpeechRecognition"
        >
          <template v-slot:more_menu>
            <q-list>
              <q-item
                v-if="medias?.length"
                clickable
                v-close-popup
                @click.prevent.stop="tab = 'medias'"
              >
                <q-item-section avatar>
                  <q-avatar
                    color="primary"
                    text-color="white"
                    icon="perm_media"
                  />
                </q-item-section>
                <q-item-section>Medias</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click.prevent.stop="tab = 'settings'"
              >
                <q-item-section avatar>
                  <q-avatar
                    color="warning"
                    text-color="white"
                    icon="settings"
                  />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>
            </q-list>
          </template>
          <template v-slot:extras_prompts>
            <template v-for="category in character.categories" :key="category">
              <q-badge>{{ category }}</q-badge>
            </template>
          </template>
        </chat-messages>
      </q-tab-panel>

      <q-tab-panel v-if="medias?.length" name="medias">
        <chat-medias
          :medias="medias"
          :character="character"
          @back="tab = 'chat'"
          @click-media="downloadMedia"
        />
      </q-tab-panel>

      <q-tab-panel name="settings">
        <chat-settings
          v-model="settings"
          :character="character"
          @back="tab = 'chat'"
          @save="saveSettings"
          @delete="deleteSettings"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import ChatMessages from 'src/components/ChatMessages.vue';
import ChatMedias from 'src/components/ChatMedias.vue';
import ChatSettings from 'src/components/ChatSettings.vue';

import {
  ChatMessage,
  ChatUser,
  ChatMessageRoles,
  ChatMessageTypes,
} from 'src/components/ChatMessages.props';
import { ChatMedia } from 'src/components/ChatMedias.props';
import { CharacterSettings } from 'src/components/ChatSettings.props';

import useApi from 'src/composables/useApi';
import useNotifications from 'src/composables/useNotifications';

const $q = useQuasar();
const $router = useRouter();
const $api = useApi();
const $notify = useNotifications();

const tab = ref<'chat' | 'medias' | 'settings'>('chat');
const chat = ref<any | null>(null);

const messages = ref<ChatMessage[]>([]);
const medias = ref<ChatMedia[]>([]);
const settings = ref<CharacterSettings | null>(new CharacterSettings());

const chatLoading = ref<boolean>(false);
const chatOptions = ref({
  connected: false,
  noConnectionLabel: 'No connection',
});

const user = ref<Partial<ChatUser>>(new ChatUser());

const character = ref<Partial<ChatUser>>(new ChatUser());

onBeforeMount(() => {
  Promise.all([loadUser(), loadChat(), loadMedias(), loadStatus()]);
});

const loadUser = async () => {
  try {
    const response = await $api.local.getSettings();
    user.value = {
      ...new ChatUser(response.name, response.name, response.avatar),
      ...response,
    };
  } catch (e) {
    console.error('error on loading user', e);
  }
};

const loadChat = async () => {
  const request = $router.currentRoute.value.params;

  try {
    const [details, chat] = await Promise.all([
      $api.local.getCharacterDetails(request),
      $api.local.getChat(request),
    ]);

    character.value = details;
    settings.value = { ...new CharacterSettings(), ...details };

    if (chat?.messages?.length) {
      messages.value = chat.messages;

      medias.value = messages.value.filter(
        (x) => x.type === ChatMessageTypes.Image
      );
    } else {
      let firstMessage = {
        ...new ChatMessage(
          details.firstMessage,
          ChatMessageRoles.System,
          new Date(),
          character.value?.key
        ),
      };
      messages.value = [firstMessage];
    }
  } catch (e) {
    console.error('error on loading chat', e);
  }
};

const loadMedias = () => {
  // const request = $router.currentRoute.value.params;
  medias.value = [
    // {
    //   name: 'test 1',
    //   src: 'https://tavernai.net/anteks/384591.webp',
    // },
    // {
    //   name: 'test 2',
    //   src: 'https://tavernai.net/tatertotrufus/0a7487.webp',
    // },
    // {
    //   name: 'test 3',
    //   src: 'https://tavernai.net/xunknown/03d58f.webp',
    // },
    // {
    //   name: 'test 4',
    //   src: 'https://tavernai.net/littlelils/4eb1fc.webp',
    // },
    // {
    //   name: 'test 5',
    //   src: 'https://tavernai.net/brokecomic/755164.webp',
    // },
    // {
    //   name: 'test 6',
    //   src: 'https://tavernai.net/megasync0003/f5054f.webp',
    // },
  ];
};

const statusGetter = ref<any | null>(null);
const loadStatus = async () => {
  try {
    const status = await $api.ragApi.generateStatus();

    if (status) {
      chatOptions.value.connected = true;
    }

    if (!statusGetter.value) {
      statusGetter.value = setInterval(async () => {
        await loadStatus();
      }, 5 * 60 * 1000);
    }
  } catch (e) {
    chatOptions.value.connected = false;
  }
};

const generateResponse = async (index = 0, last = 0) => {
  let data =
    index <= 0 && last > 0
      ? messages.value?.slice(index, last)
      : messages.value;

  data =
    data.filter(
      (x) =>
        x.type === ChatMessageTypes.Text ||
        (x.type !== ChatMessageTypes.Image &&
          x.type !== ChatMessageTypes.Speech)
    ) ?? [];

  const body = {
    messages: data,
  };

  const responses = await $api.ragApi.generateResponse(null, body);
  const response = responses?.choices[0]?.message?.content;
  return response;
};

const sendMessage = async (newMessage: string) => {
  try {
    saveChat();

    chatLoading.value = true;
    const response = await generateResponse();

    addMessage(response, ChatMessageRoles.Assistant);
  } catch (e) {
    console.error('error on sending chat', e);
    $notify.error('Error on sending message.');
  } finally {
    chatLoading.value = false;
  }
};

const addMessage = (
  response: string | undefined,
  role: ChatMessageRoles,
  type: ChatMessageTypes = ChatMessageTypes.Text
) => {
  if (!response || response.toString()?.trim() === '') {
    return;
  }

  chatLoading.value = true;
  const waitingTime = 100; //Math.floor(Math.random() * 5000);
  setTimeout(() => {
    if (!chat.value?.addMessage) {
      chatLoading.value = false;
      return;
    }

    chat.value.addMessage(response, role, character.value?.key, type);
    chatLoading.value = false;

    saveChat();
  }, waitingTime);
};

const resendMessage = async (message: ChatMessage, index: number) => {
  try {
    chatLoading.value = true;
    if (message.role === ChatMessageRoles.Assistant) {
      const response = await generateResponse(
        index,
        messages.value.length - index
      );

      messages.value[index].content = response;

      saveChat();
    } else {
      sendMessage('');
    }
  } catch (e) {
    console.error('error on resending chat', e);
    $notify.error('Error on resending message.');
  } finally {
    chatLoading.value = false;
  }
};

const saveChat = async () => {
  try {
    const request = $router.currentRoute.value.params;
    await $api.local.saveChat(request, { messages: messages.value });
  } catch (e) {
    console.error('error on saving chat', e);
  }
};

const deleteMessage = (message: ChatMessage, index: number) => {
  $q.dialog({
    title: 'Delete message confirmation',
    message: 'Are you sure you want to delete this message ?',
    ok: {
      icon: 'delete',
      color: 'negative',
      rounded: true,
    },
    cancel: {
      label: 'Cancel',
      color: 'warning',
      rounded: true,
      flat: true,
    },
  }).onOk(() => {
    // const index = messages.value.findIndex((x) => x.stamp === message.stamp);
    // if (index === -1) return;

    messages.value.splice(index, 1);
    saveChat();
  });
};

const back = () => {
  $router.back();
};

const saveSettings = async (newSettings: CharacterSettings) => {
  const request = $router.currentRoute.value.params;
  try {
    await $api.local.saveCharacterDetails(request, settings.value);
    $notify.success('Settings saved.');
  } catch (e) {
    console.error('error on saving settings', e);
    $notify.error('Error on saving settings.');
  }
};

const deleteSettings = async () => {
  $q.dialog({
    title: 'Delete character confirmation',
    message: 'Are you sure you want to delete this character ?',
    ok: {
      icon: 'delete',
      color: 'negative',
      rounded: true,
    },
    cancel: {
      label: 'Cancel',
      color: 'warning',
      rounded: true,
      flat: true,
    },
  }).onOk(async () => {
    const request = $router.currentRoute.value.params;
    try {
      await $api.local.deleteCharacterDetails(request);
      $router.back();
    } catch (e) {
      console.error('error on delete settings', e);
      $notify.error('Error on delete settings.');
    }
  });
};

const downloadMedia = (media: ChatMedia) => {
  console.debug('download media', media);
};

const requestImage = async (prompt: string) => {
  try {
    chatLoading.value = true;
    const response = await $api.ragApi.generateImage(null, { prompt });
    const data = await blobToBase64(response);
    addMessage(data, ChatMessageRoles.Assistant, ChatMessageTypes.Image);
  } catch (e) {
    console.error('error on saving settings', e);
    $notify.error('Error on generating image.');
  } finally {
    chatLoading.value = false;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const requestSpeechRecognition = async () => {
  console.debug('request speech recognition');
};

onBeforeUnmount(() => {
  if (statusGetter.value) {
    clearInterval(statusGetter.value);
  }
});
</script>

<style lang="scss" scoped></style>
