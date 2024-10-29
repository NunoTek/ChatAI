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

      <q-btn
        icon="delete"
        color="negative"
        class="float-right"
        rounded
        flat
        @click.prevent.stop="deleteSettings()"
      />
    </div>

    <div class="col-12 row justify-between">
      <q-toggle
        v-model="value.generateImages"
        label="Generate Images"
        class="col-md-12 col-lg-3"
      />
      <q-toggle
        v-model="value.generateAudios"
        label="Generate Audios"
        class="col-md-12 col-lg-3"
      />
      <q-toggle
        v-model="value.generateVideos"
        label="Generate Videos"
        class="col-md-12 col-lg-3"
      />
      <q-toggle
        v-model="value.nsfw"
        label="NSFW"
        class="col-xs-12 col-md-3 col-lg-2"
      />
    </div>

    <div class="col-12">
      <q-select
        v-model="value.categories"
        label="Categories"
        use-input
        input-debounce="0"
        use-chips
        multiple
        outlined
        hide-dropdown-icon
        @new-value="(val, done) => done(val, 'add-unique')"
      />
    </div>

    <q-expansion-item
      v-model="data.appearanceExpand"
      label="Appearance"
      icon="palette"
      class="col-12"
    >
      <q-input v-model="value.appearance" autogrow outlined />
    </q-expansion-item>

    <q-expansion-item
      v-model="data.scenarioExpand"
      label="Scenario"
      icon="menu_book"
      class="col-12"
    >
      <q-input v-model="value.scenario" autogrow outlined />
    </q-expansion-item>

    <q-expansion-item
      v-model="data.personalityExpand"
      label="Personality"
      icon="mood"
      class="col-12"
    >
      <q-input v-model="value.personality" autogrow outlined />
    </q-expansion-item>

    <q-expansion-item
      v-model="data.dialoguesExpand"
      label="Dialogues"
      icon="forum"
      class="col-12"
    >
      <q-input v-model="value.dialogues" autogrow outlined />
    </q-expansion-item>

    <q-expansion-item
      v-model="data.descriptionExpand"
      label="Description"
      icon="description"
      class="col-12"
    >
      <q-input v-model="value.description" autogrow outlined />
    </q-expansion-item>

    <q-expansion-item
      v-model="data.firstMessageExpand"
      label="First Message"
      icon="chat"
      class="col-12"
    >
      <q-input v-model="value.firstMessage" autogrow outlined />
    </q-expansion-item>

    <div class="col-12">
      <q-btn
        label="Save"
        color="primary"
        class="fit"
        @click.prevent.stop="save"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import { ChatSettingsProps, CharacterSettings } from './ChatSettings.props';
import { ChatSettingsEvents } from './ChatSettings.events';

const $props = defineProps<ChatSettingsProps>();
const $emits = defineEmits(ChatSettingsEvents);

const data = ref({
  appearanceExpand: false,
  scenarioExpand: false,
  personalityExpand: false,
  dialoguesExpand: false,
  descriptionExpand: false,
  firstMessageExpand: false,
});

const value = computed({
  get: () => {
    return $props.modelValue ?? new CharacterSettings();
  },
  set: (val) => {
    $emits(ChatSettingsEvents.updateSettings, val);
  },
});

const save = () => {
  $emits(ChatSettingsEvents.save, value.value);
};

const back = () => {
  $emits(ChatSettingsEvents.back);
};

const deleteSettings = () => {
  $emits(ChatSettingsEvents.delete);
};
</script>

<style lang="scss" scoped></style>
