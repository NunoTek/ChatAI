<template>
  <q-layout view="hHr LpR fFf">
    <q-header v-if="isDesktop" elevated>
      <q-toolbar class="bg-dark">
        <q-btn
          icon="menu"
          flat
          rounded
          dense
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <router-link :to="{ name: 'board' }" style="text-decoration: none">
            <q-avatar>
              <img src="/logo.png" alt="Logo" />
            </q-avatar>
            <span class="text-primary"> Chat AI </span>
          </router-link>
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="isDesktop" v-model="leftDrawerOpen" :mini="true" bordered>
      <div class="row q-col-gutter-md">
        <q-list class="col-12 q-mt-sm q-gutter-xs">
          <q-item-label header> </q-item-label>

          <q-item :to="{ name: 'board' }" clickable>
            <q-item-section avatar>
              <q-icon name="home">
                <q-tooltip :delay="1000">
                  <span class="text-subtitle2">Home</span>
                </q-tooltip>
              </q-icon>
            </q-item-section>
            <q-item-section> Home </q-item-section>
          </q-item>
          <q-item :to="{ name: 'chats' }" clickable>
            <q-item-section avatar>
              <q-icon name="forum">
                <q-tooltip :delay="1000">
                  <span class="text-subtitle2">Chats</span>
                </q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
        </q-list>

        <div
          class="col-12 text-center absolute"
          style="bottom: 18px; right: 8px"
        >
          <q-btn
            :color="$q.dark.isActive ? 'light' : 'dark'"
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            size="12px"
            round
            dense
            flat
            @click.prevent.stop="toggleDarkMode()"
          />

          <q-list>
            <q-item :to="{ name: 'settings' }" clickable>
              <q-item-section avatar>
                <q-icon name="settings">
                  <q-tooltip :delay="1000">
                    <span class="text-subtitle2">Settings</span>
                  </q-tooltip>
                </q-icon>
              </q-item-section>
              <q-item-section> Settings </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="overflow-auto" style="height: 100vh; width: 100vw">
      <router-view />
    </q-page-container>

    <q-footer v-if="isMobile" v-show="availableRoutes" class="bg-dark" elevated>
      <div class="row justify-around text-h5">
        <router-link :to="{ name: 'chats' }">
          <q-avatar icon="forum" rounded>
            <q-tooltip :delay="2000">
              <span class="text-subtitle2">Chats</span>
            </q-tooltip>
          </q-avatar>
        </router-link>
        <router-link :to="{ path: '/chats/onitek/lucy' }">
          <q-avatar color="warning" icon="add" rounded>
            <q-tooltip :delay="2000">
              <span class="text-subtitle2">>New</span>
            </q-tooltip>
          </q-avatar>
        </router-link>
        <router-link :to="{ name: 'board' }">
          <q-avatar icon="home" rounded>
            <q-tooltip :delay="2000">
              <span class="text-subtitle2">Home</span>
            </q-tooltip>
          </q-avatar>
        </router-link>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';

import useScreen from 'src/composables/useScreen';

const $q = useQuasar();
const $route = useRoute();
const { isDesktop, isMobile } = useScreen();

const leftDrawerOpen = ref(true);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleDarkMode = () => {
  $q.dark.set(!$q.dark.isActive);
};

const availableRoutes = computed(() => {
  return $route.name !== 'chat';
});
</script>
