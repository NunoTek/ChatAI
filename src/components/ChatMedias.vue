<template>
  <div class="fit row q-pa-md q-col-gutter-md">
    <div class="col-12 column relative items-center text-center q-gutter-xs">
      <q-btn
        icon="arrow_back"
        class="float-left"
        rounded
        flat
        @click.prevent.stop="back()"
      />

      <q-avatar size="128px" style="z-index: 666" rounded>
        <q-img :src="character.avatar" style="object-position: center top" />
      </q-avatar>

      <span class="text-h5">{{ character.name }}</span>
    </div>

    <div class="col-12 fit q-pa-sm">
      <p class="text-h5">Medias</p>
      <div class="row q-col-gutter-sm">
        <template v-for="media in medias" :key="media.src">
          <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2 col-xl-2 q-pl-md">
            <chat-media-card :media @click="clickMedia" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChatMediasProps, ChatMedia } from './ChatMedias.props';
import { ChatMediasEvents } from './ChatMedias.events';

import ChatMediaCard from 'src/components/ChatMediaCard.vue';

defineProps<ChatMediasProps>();

const $emits = defineEmits(ChatMediasEvents);

const clickMedia = (media: ChatMedia) => {
  $emits(ChatMediasEvents.clickMedia, media);
};

const back = () => {
  $emits(ChatMediasEvents.back);
};
</script>

<style lang="scss" scoped></style>
