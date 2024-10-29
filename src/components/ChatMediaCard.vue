<template>
  <q-card
    class="media-card row cursor-pointer"
    v-bind="$attrs"
    dense
    flat
    @click.prevent.stop="click()"
  >
    <q-avatar class="fit" rounded>
      <q-img :src="media.src" :alt="media.name">
        <span class="absolute-bottom-right text-weight-thin">
          {{ media.name }}
        </span>
      </q-img>
    </q-avatar>
  </q-card>
</template>

<script lang="ts" setup>
import { DefaultComponentEvents } from './DefaultComponent.events';

import { ChatMedia } from './ChatMedias.props';

interface ChatMediaCardProps {
  media: ChatMedia;
}

const $props = defineProps<ChatMediaCardProps>();

const $emits = defineEmits(DefaultComponentEvents);

const click = () => {
  $emits(DefaultComponentEvents.click, $props.media);
};
</script>

<style lang="scss" scoped>
.media-card {
  max-width: 300px;
}
</style>
