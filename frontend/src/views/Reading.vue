<template>
  <v-container fluid class="pa-0 ma-0 fill-height">
    <splitpanes class="default-theme">
      <pane size="65" min-size="30">
        <FileSelector v-if="!file" @on-selected="(fn) => file = fn" />
        <PDFViewer v-else :file="file" />
      </pane>
      <pane size="35" min-size="20">
        <ChatBox :disable-chat="!file" @on-change-file="file = null" />
      </pane>
    </splitpanes>
  </v-container>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import FileSelector from '@/components/FileSelector.vue';
import ChatBox from '@/components/ChatBox.vue';
import PDFViewer from '@/components/PDFViewer.vue';

import { ref } from 'vue'
const file = ref(null)

</script>
