<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>
        <v-icon icon="mdi-book-open-page-variant" />
        ResearchGPT
      </v-app-bar-title>
      <!-- <v-btn icon>
        <v-icon icon="mdi-dots-vertical" />
        <v-menu activator="parent">
          <v-list @click:select="handleClickMenu">
            <v-list-item v-for="(item, index) in items" :key="index" :value="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const items = ref([
  { title: 'Home', route: "Home" },
  { title: 'Reading', route: "Reading" },
  { title: "About", route: "About" },
])

const handleClickMenu = (e) => {
  router.push({
    name: items.value[e.id].route
  })
}

</script>
