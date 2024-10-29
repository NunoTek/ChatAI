<template>
  <q-page class="fit q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 column relative items-center text-center q-gutter-xs">
        <q-btn
          icon="arrow_back"
          class="float-left"
          rounded
          flat
          @click.prevent.stop="back()"
        />

        <q-avatar size="128px" style="z-index: 666" rounded>
          <q-img :src="settings.avatar" style="object-position: center top" />
        </q-avatar>

        <span class="text-h5">{{ settings.name }}</span>
      </div>

      <div class="col-12">
        <q-input v-model="settings.name" label="Name" autogrow outlined />
      </div>

      <div class="col-12">
        <q-input
          v-model="settings.avatar"
          label="Avatar Url"
          autogrow
          outlined
        />
      </div>

      <div class="col-12">
        <q-input
          v-model="settings.secretKey"
          label="Secret Key"
          autogrow
          outlined
        />
      </div>

      <div class="col-12">
        <q-btn
          label="Save"
          color="primary"
          class="fit"
          @click.prevent.stop="saveSettings"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import useApi from 'src/composables/useApi';
import useNotification from 'src/composables/useNotifications';

const $router = useRouter();
const $api = useApi();
const $notify = useNotification();

const settings = ref({
  name: '',
  avatar: '',
  secretKey: '',
});

onBeforeMount(() => {
  loadSettings();
});

const loadSettings = async () => {
  try {
    settings.value = await $api.local.getSettings();
  } catch (error) {
    console.error('Failed to load settings', error);
  }
};

const saveSettings = async () => {
  try {
    await $api.local.saveSettings(settings.value);

    $notify.success('Settings saved');
  } catch (error) {
    console.error('Failed to set settings', error);
  }
};

const back = () => {
  $router.back();
};
</script>

<style lang="scss" scoped></style>
