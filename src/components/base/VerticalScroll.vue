<template>
  <div class="vertical-scroll full-width" :class="uniqueScroll">
    <!-- <q-btn
      v-if="maxScroll > 0"
      :disable="position <= 0"
      class="sticky-left"
      icon="arrow_left"
      rounded
      outline
      @click.prevent.stop="scrollLeft()"
    />

    <q-btn
      v-if="maxScroll > 0"
      :disable="position >= maxScroll"
      class="sticky-right"
      icon="arrow_right"
      rounded
      outline
      @click.prevent.stop="scrollRight()"
    /> -->

    <div
      class="vertical-scroll-container row no-wrap"
      v-bind="$attrs"
      v-scroll="onScroll"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const generateUid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const instanceId = generateUid();
const position = ref(0);

const uniqueScroll = `scroll-${instanceId}`;

// TODO: vertical scroll
const onScroll = (value: number) => {
  position.value = value;
};

// const maxScroll = computed(() => {
//   const container = document.querySelector(
//     `.${uniqueScroll} .vertical-scroll-container`
//   ) as HTMLElement;
//   return (container?.scrollWidth ?? 0) - (container?.clientWidth ?? 0);
// });

// const scrollLeft = () => {
//   const container = document.querySelector(
//     `.${uniqueScroll} > .vertical-scroll-container`
//   ) as HTMLElement;
//   container.scrollLeft -= 300;
//   position.value = container.scrollLeft;
// };

// const scrollRight = () => {
//   const container = document.querySelector(
//     `.${uniqueScroll} > .vertical-scroll-container`
//   ) as HTMLElement;
//   container.scrollLeft += 300;
//   position.value = container.scrollLeft;
// };
</script>

<style lang="scss" scoped>
.vertical-scroll {
  position: relative;
  display: inline-grid;
  max-width: 100% !important;
}

.vertical-scroll-container {
  position: relative;
  overflow: auto;
  scroll-behavior: smooth;
  z-index: 600;
}

.sticky-left {
  position: absolute;
  z-index: 666;
  left: 0px;
  top: 45%;
}

.sticky-right {
  position: absolute;
  z-index: 666;
  right: 0px;
  top: 45%;
}
</style>
