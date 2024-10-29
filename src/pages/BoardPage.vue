<template>
  <q-page class="column q-pa-sm">
    <div class="row q-gutter-md q-mb-sm">
      <q-input
        v-model="search"
        label="Name"
        clearable
        outlined
        @keyup.enter.stop="searchCharacters()"
      />
      <q-select
        v-model="category"
        :options="categoriesOptions"
        label="Categories"
        clearable
        map-options
        option-value="name"
        option-label="name_view"
        emit-value
        use-input
        input-debounce="500"
        outlined
        @filter="filterFn"
      />
      <q-toggle v-model="nsfw" :false-value="0" :true-value="1" label="NSFW" />
      <q-btn
        icon="search"
        color="primary"
        label="Search"
        @click.prevent.stop="searchCharacters()"
      />
    </div>

    <template v-for="category in boardCategories" :key="category.name">
      <q-card class="fit q-pa-sm" flat>
        <p class="text-h5">{{ category.name }}</p>
        <vertical-scroll>
          <template v-for="char in category.characters" :key="char.key">
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2 col-xl-2 q-pl-md">
              <char-card :char="char" @click="goToDetails" />
            </div>
          </template>
        </vertical-scroll>
      </q-card>
    </template>
  </q-page>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import useApi from 'src/composables/useApi';

import VerticalScroll from 'src/components/base/VerticalScroll.vue';
import CharCard from 'src/components/CharCard.vue';

const $q = useQuasar();
const $api = useApi();
const $router = useRouter();

const boardCategories = ref<any[]>([]);
const search = ref<string | null>(null);
const categoriesOptions = ref<any[]>([]);
const categories = ref<any[]>([]);
const category = ref<string | null>(null);
const nsfw = ref<number>(0);

onBeforeMount(() => {
  Promise.all([searchCharacters(), loadCategories()]);
});

const searchCharacters = async () => {
  $q.loading.show();
  try {
    const params = { search: search.value, nsfw: nsfw.value };
    if (category.value && category.value !== '') {
      const response = await $api.local.listCategoriesCharacters(
        category.value,
        params
      );
      boardCategories.value = [
        {
          name: category.value,
          characters: [...response],
        },
      ];
      return;
    }

    if (search.value && search.value !== '') {
      const response = await $api.local.searchCharacters(params);

      boardCategories.value = [
        {
          name: `Search ${search.value}`,
          characters: [...response.characters],
        },
        ...(response.categories ?? []),
      ];

      // categoriesOptions.value = response.categories;
      return;
    }

    boardCategories.value = await $api.local.board(params);
  } catch (error) {
    console.error('error while loading characters', error);
  } finally {
    $q.loading.hide();
  }
};

const loadCategories = async () => {
  try {
    categories.value = await $api.local.listCategories({ nsfw: nsfw.value });
  } catch (error) {
    console.error('error while loading categories', error);
  }
};

const filterFn = (val: string | null, update: any) => {
  if (!val || val === '') {
    update(() => {
      categoriesOptions.value = categories.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    categoriesOptions.value = categories.value.filter(
      (v) => v.name_view.toLowerCase().indexOf(needle) > -1
    );
    console.log('filtered categories', needle, categoriesOptions.value);
  });
};

const goToDetails = (item: any) => {
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
