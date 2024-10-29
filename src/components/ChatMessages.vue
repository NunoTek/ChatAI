<template>
  <div class="chat">
    <div class="chat__container q-pa-md">
      <slot name="header">
        <div class="chat__header">
          <div class="row">
            <div class="col-shrink text-left">
              <q-btn
                icon="arrow_back"
                rounded
                flat
                @click.prevent.stop="back()"
              />
            </div>
            <div class="col text-center">
              <q-avatar
                :size="avatarSize"
                class="cursor-pointer"
                style="z-index: 666"
                rounded
                @click.prevent.stop="toggleAvatarSize"
              >
                <q-img
                  :src="character.avatar"
                  style="object-position: center top"
                />
              </q-avatar>
            </div>
            <div class="col-shrink text-right">
              <q-btn
                v-if="settings?.generateAudios"
                icon="call"
                rounded
                flat
                disable
              />

              <q-btn
                v-if="settings?.generateVideos"
                icon="videocam"
                rounded
                flat
                disable
              />

              <q-btn icon="more_vert" rounded flat dense>
                <q-menu fit anchor="bottom left" self="top left">
                  <slot name="more_menu">
                    <div class="row no-wrap q-pa-md">
                      <div class="column">
                        <div class="text-h6 q-mb-md">Settings</div>
                        <q-toggle :value="true" label="Use Mobile Data" />
                        <q-toggle :value="true" label="Bluetooth" />
                      </div>

                      <q-separator vertical inset class="q-mx-lg" />

                      <div class="column items-center">
                        <q-avatar size="72px">
                          <q-img
                            :src="currentUser.avatar"
                            :alt="currentUser.name"
                            rounded
                          />
                        </q-avatar>

                        <div class="text-subtitle1 q-mt-md q-mb-xs">
                          {{ currentUser.name }}
                        </div>

                        <q-btn
                          color="primary"
                          label="Logout"
                          push
                          size="sm"
                          v-close-popup
                        />
                      </div>
                    </div>
                  </slot>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>
      </slot>

      <slot>
        <div class="chat__content">
          <template v-if="!messages?.length">
            <div class="chat__content-empty row q-gutter-xs">
              <div class="full-width q-py-md text-center">
                <span class="text-weight-thin">{{
                  options.noMessagesLabel
                }}</span>
              </div>
            </div>
            <div v-if="receiverLoading" class="chat__content-loading">
              <q-chat-message
                :name="character.name"
                :text-color="textColor({ role: ChatMessageRoles.System })"
                :bg-color="bgColor({ role: ChatMessageRoles.System })"
              >
                <q-spinner-dots size="2rem" />
              </q-chat-message>
            </div>
          </template>
          <template v-else>
            <q-scroll-area
              ref="contentScroll"
              class="chat__content-container fit column"
              :key="componentKey"
            >
              <div class="chat__content-texts q-gutter-md">
                <!-- :avatar="message.avatar" -->
                <template
                  v-for="(message, index) in chatMessages"
                  :key="`${index}-${message.stamp}`"
                >
                  <template v-if="message.editMode">
                    <q-chat-message
                      :name="message.name"
                      :sent="message.role === ChatMessageRoles.User"
                      :bg-color="bgColor(message)"
                      class="chat__content-text"
                    >
                      <q-input
                        v-model="message.content"
                        autogrow
                        standout
                        @keyup.enter.stop="editMessage(message, index)"
                        @keyup.esc.stop="cancelEditMessage(message)"
                        @blur="cancelEditMessage(message)"
                      >
                        <template v-slot:append>
                          <div class="row q-gutter-xs">
                            <q-btn
                              :disable="!message.content"
                              icon="send"
                              rounded
                              flat
                              @click.prevent.stop="editMessage(message, index)"
                            />
                          </div>
                        </template>
                      </q-input>
                    </q-chat-message>
                  </template>
                  <template v-else>
                    <template v-if="message.type == ChatMessageTypes.Image">
                      <q-chat-message
                        :id="`msg_${index}`"
                        :label="message.label"
                        :name="message.name"
                        :sent="message.role === ChatMessageRoles.User"
                        :text="formatTexts(message.text)"
                        text-html
                        :stamp="formatStamp(message.stamp)"
                        :text-color="textColor(message)"
                        :bg-color="bgColor(message)"
                        class="chat__content-text"
                      >
                        <q-avatar class="fit" rounded>
                          <q-img
                            :src="message.text[0]"
                            fit="fill"
                            style="width: 256px; height: auto"
                          />
                        </q-avatar>
                      </q-chat-message>
                    </template>
                    <template v-else>
                      <q-chat-message
                        :id="`msg_${index}`"
                        :label="message.label"
                        :name="message.name"
                        :sent="message.role === ChatMessageRoles.User"
                        :text="formatTexts(message.text)"
                        text-html
                        :stamp="formatStamp(message.stamp)"
                        :text-color="textColor(message)"
                        :bg-color="bgColor(message)"
                        class="chat__content-text"
                      />
                    </template>
                    <q-menu :target="`#msg_${index}`" touch-position>
                      <div class="row no-wrap">
                        <q-item
                          clickable
                          v-close-popup
                          @click.prevent.stop="editMessage(message)"
                        >
                          <q-item-section>
                            <q-avatar icon="edit" />
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click.prevent.stop="resendMessage(message, index)"
                        >
                          <q-item-section>
                            <q-avatar icon="repeat" />
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click.prevent.stop="deleteMessage(message, index)"
                        >
                          <q-item-section>
                            <q-avatar icon="delete" />
                          </q-item-section>
                        </q-item>
                      </div>
                    </q-menu>
                  </template>
                </template>
              </div>

              <div v-if="receiverLoading" class="chat__content-loading">
                <q-chat-message
                  :name="character.name"
                  :text-color="textColor({ role: ChatMessageRoles.Assistant })"
                  :bg-color="bgColor({ role: ChatMessageRoles.Assistant })"
                >
                  <q-spinner-dots size="2rem" />
                </q-chat-message>
              </div>
            </q-scroll-area>
          </template>
        </div>
      </slot>

      <slot name="prompts">
        <div class="chat__prompts row q-col-gutter-xs">
          <div class="col-12 row q-gutter-xs">
            <slot name="extras_prompts"></slot>
          </div>

          <q-input
            v-model="newMessage"
            placeholder="Type a message"
            class="col-12"
            autogrow
            outlined
            @keyup.enter.stop="sendMessage"
          >
            <template v-slot:prepend>
              <div v-if="settings?.generateImages" class="row q-gutter-xs">
                <q-btn
                  icon="attach_file"
                  rounded
                  flat
                  @click.prevent.stop="requestImage"
                />
              </div>
            </template>

            <template v-slot:append>
              <div class="row q-gutter-xs">
                <q-btn
                  :disable="emptyNewMessage"
                  icon="send"
                  rounded
                  flat
                  @click.prevent.stop="sendMessage"
                />

                <q-btn
                  v-if="settings?.generateAudios"
                  :disabled="!hasMediaDevices"
                  icon="mic"
                  rounded
                  flat
                  @click.prevent.stop="requestSpeechRecognition"
                />
              </div>
            </template>
          </q-input>

          <div v-if="!options.connected" class="col-12 row q-gutter-xs">
            <span class="text-weight-thin">
              <q-icon name="cloud_off" color="negative" />
              {{ options.noConnectionLabel }}
            </span>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { date, QScrollArea } from 'quasar';

import {
  ChatMessagesProps,
  ChatMessageRoles,
  ChatMessageTypes,
  ChatMessage,
} from './ChatMessages.props';
import { ChatMessagesEvents } from './ChatMessages.events';

const componentKey = ref(0);
const $props = withDefaults(defineProps<ChatMessagesProps>(), {
  receiverLoading: false,
  options: {
    connected: false,
    noConnectionLabel: 'No connection',
    noMessagesLabel: 'No message...',
  },
});
const $emits = defineEmits(ChatMessagesEvents);

const messages = computed({
  get: () => {
    return $props.modelValue ?? [];
  },
  set: (val) => {
    $emits(ChatMessagesEvents.updateMessages, val);
  },
});

const chatMessages = computed(() => formatToChatMessages(messages.value));

const contentScroll = ref<QScrollArea | undefined>(undefined);
const avatarSize = ref('64px');
const newMessage = ref('');

const hasMediaDevices = computed(() => {
  return navigator.mediaDevices != null;
});

const emptyNewMessage = computed(() => {
  return newMessage.value == null || newMessage.value.trim() === '';
});

const formatToChatMessages = (messages: ChatMessage[]) => {
  if (!messages?.length) return [];

  const result = [];
  for (const index in messages) {
    const data = messages[index];
    const message = {
      ...data,
      text: [data.content],
      name: !data.userKey
        ? null
        : data.userKey === $props.currentUser.key
        ? $props.currentUser.name
        : $props.character.name,
      avatar: !data.userKey
        ? null
        : data.userKey === $props.currentUser.key
        ? $props.currentUser.avatar
        : $props.character.avatar,

      editMode: false,
    };

    const lastMessage = result?.length ? result[result.length - 1] : null;
    if (message && lastMessage) {
      const exeededTime =
        Math.abs((message.stamp ?? 0) - (lastMessage.stamp ?? 0)) >
        1 * 24 * 60 * 60 * 1000;
      if (exeededTime) {
        result.push({
          label: date.formatDate(lastMessage.stamp, 'DD/MM/YY HH:mm'),
        });
      }

      if (!exeededTime && lastMessage.role === message.role) {
        lastMessage.text = [...lastMessage.text, data.content];
        lastMessage.stamp = messages[index].stamp;
        result[result.length - 1] = lastMessage;
        continue;
      }
    }

    result.push(message);
  }

  return result;
};

const formatTexts = (content: string[]) => {
  if (!content?.length) return [];
  const result = content.map((x) =>
    x
      .replace(/{{[Uu][Ss][Ee][Rr]}}/g, $props.currentUser.name)
      .replace('{{[Cc][Hh][Aa][Rr]}}', $props.character.name)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.+?)\*/g, '<i>*$1*</i>')
      .replace(/\"(.+?)\"/g, '<span>*$1*</span>')
      .replace(/\n/g, '<br/>')
  );
  return result;
};

const formatStamp = computed(() => {
  return (stamp: Date) => {
    const now = new Date();
    const stampDate = new Date(stamp);
    const diffTime = Math.abs(now - stampDate);

    const secsAgo = Math.floor(diffTime / 1000);
    const minsAgo = Math.floor(diffTime / (1000 * 60));
    const hoursAgo = Math.floor(diffTime / (1000 * 60 * 60));

    if (secsAgo <= 0) {
      return 'now';
    } else if (secsAgo < 60) {
      return `${secsAgo} seconds agos`;
    } else if (minsAgo < 60) {
      return `${minsAgo} minute(s) agos`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hour(s) agos`;
    } else {
      return date.formatDate(stamp, 'DD/MM/YY HH:mm');
    }
  };
});

const textColor = (message: ChatMessage) => {
  return message.role === ChatMessageRoles.User ? 'white' : 'white';
};

const bgColor = (message: ChatMessage) => {
  return message.role === ChatMessageRoles.User ? 'primary' : 'dark';
};

const back = () => {
  $emits(ChatMessagesEvents.back);
};

const toggleAvatarSize = () => {
  const avatarSizes = ['64px', '128px', '256px'];
  const indexOf = avatarSizes.indexOf(avatarSize.value);
  const index = avatarSizes?.length - 1 != indexOf ? indexOf + 1 : 0;
  avatarSize.value = avatarSizes[index];
};

const sendMessage = async () => {
  if (emptyNewMessage.value) return;

  addMessage(newMessage.value, ChatMessageRoles.User, $props.currentUser?.key);

  await $emits(ChatMessagesEvents.sendMessage, newMessage.value);

  newMessage.value = '';
};

const addMessage = (
  newContent: string,
  role = ChatMessageRoles.User,
  userKey: string | undefined = undefined,
  type = ChatMessageTypes.Text
) => {
  if (newContent == null || newContent.trim() === '') return;

  const message = new ChatMessage(newContent, role, new Date(), userKey, type);
  messages.value.push(message);

  // contentScroll.value.setScrollPercentage('vertical', 1.0, 1000);
  setTimeout(() => {
    if (contentScroll.value && contentScroll.value.getScrollPercentage()?.top) {
      contentScroll.value.setScrollPercentage('vertical', 1.0, 500);
    }
  }, 1000);
};

const editMessage = async (
  message: ChatMessage,
  index: number | undefined = undefined
) => {
  if (index) {
    message.content = message.content.trim();
    messages.value[index].content = message.content;
    message.editMode = false;

    await $emits(ChatMessagesEvents.saveMessages, messages.value, index);
    componentKey.value += 1;

    return;
  }

  message.editMode = true;
  componentKey.value += 1;
};

const cancelEditMessage = (message: ChatMessage) => {
  message.editMode = false;
  componentKey.value += 1;
};

const resendMessage = async (message: ChatMessage, index: number) => {
  await $emits(ChatMessagesEvents.resendMessage, message, index);
};

const deleteMessage = async (message: ChatMessage, index: number) => {
  await $emits(ChatMessagesEvents.deleteMessage, message, index);
};

const requestImage = async () => {
  if (emptyNewMessage.value) return;

  addMessage(newMessage.value, ChatMessageRoles.User, $props.currentUser?.key);

  await $emits(ChatMessagesEvents.requestImage, newMessage.value);

  newMessage.value = '';
};

const requestSpeechRecognition = async () => {
  await $emits(ChatMessagesEvents.requestSpeechRecognition);
};

defineExpose({
  emptyNewMessage,
  addMessage,
});
</script>

<style lang="scss" scoped>
.chat {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  position: relative;
  display: flex;

  &__container {
    margin-top: 70px;
    margin-bottom: 80px;

    width: 100%;
    height: auto;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  &__header {
    position: absolute;
    top: 12px;
    width: 97%;
  }

  &__content {
    width: 100% !important;
    max-width: 100% !important;

    min-height: 75dvh;
    max-height: 75dvh;
  }

  &__prompts {
    position: absolute;
    bottom: 0px;
    width: 97%;
  }
}
</style>
