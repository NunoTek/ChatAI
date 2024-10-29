<template>
  <q-card
    class="char-card row cursor-pointer q-col-gutter-xs"
    v-bind="$attrs"
    dense
    flat
    @click.prevent.stop="click()"
  >
    <div class="col-12">
      <q-avatar class="fit" rounded>
        <q-img :src="char.avatar" :alt="char.name">
          <span
            class="absolute-bottom-right text-weight-thin q-pb-sm q-pr-xs"
            style="font-size: 14px"
          >
            @{{ char.user_name }}
          </span>
        </q-img>
      </q-avatar>
    </div>
    <div class="col-12 ellipsis">
      <span class="text-h6">{{ char.name }}</span>
      <q-tooltip :delay="1000">
        <span class="text-subtitle2">{{ char.name }}</span>
      </q-tooltip>
    </div>
    <div class="col-12 ellipsis">
      <span class="text-weight-thin">{{ char.description }}</span>
      <q-tooltip :delay="1000">
        <span class="text-subtitle2">{{ char.description }}</span>
      </q-tooltip>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
import { DefaultComponentEvents } from './DefaultComponent.events';

interface Props {
  char: {
    name: string;
    avatar: string | undefined;
    description: string | undefined;
  };
}

const $props = defineProps<Props>();

const $emits = defineEmits(DefaultComponentEvents);

const click = () => {
  $emits(DefaultComponentEvents.click, $props.char);
};
</script>

<style lang="scss" scoped>
.char-card {
  max-width: 300px;
}
</style>
