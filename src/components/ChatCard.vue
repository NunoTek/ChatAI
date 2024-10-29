<template>
  <q-card
    class="chat-card row cursor-pointer"
    v-bind="$attrs"
    dense
    flat
    @click.prevent.stop="click()"
  >
    <div class="col-4">
      <q-avatar class="fit" rounded>
        <q-img :src="chat.avatar" :alt="chat.name" />
      </q-avatar>
    </div>
    <div class="col-8 q-pl-md q-pr-sm column q-gutter-md">
      <div class="q-pt-md ellipsis">
        <span class="text-h6">{{ chat.name }}</span>
        <q-tooltip :delay="1000">
          <span class="text-subtitle2">{{ chat.name }}</span>
        </q-tooltip>
      </div>
      <div class="ellipsis">
        <span class="text-weight-thin">{{ chat.lastMessage }}</span>
        <q-tooltip :delay="1000">
          <span class="text-subtitle2">{{ chat.lastMessage }}</span>
        </q-tooltip>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
import { DefaultComponentEvents } from './DefaultComponent.events';

interface Props {
  chat: {
    name: string;
    avatar: string | undefined;
    lastMessage: string | undefined;
  };
}

const $props = defineProps<Props>();

const $emits = defineEmits(DefaultComponentEvents);

const click = () => {
  $emits(DefaultComponentEvents.click, $props.chat);
};
</script>

<style lang="scss" scoped>
.chat-card {
  max-height: 500px;
  overflow: hidden;
}
</style>
