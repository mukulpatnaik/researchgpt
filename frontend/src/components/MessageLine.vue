<template>
  <v-row no-gutters :style='`margin: 15px 0; justify-content: ${props.left ? "flex-begin" : "flex-end"};`'>
    <v-col cols="auto" style="max-width: 90%">
      <v-card :style="`border-radius: 15px 15px ${props.left ? '15px 0' : '0 15px'};`" elevation="2" density="compact"
        :color='props.left ? "white" : "primary"'>
        <v-card-text style="white-space: pre-wrap;">
          {{ props.text }}
        </v-card-text>
        <v-divider v-if="!!props.sources && props.sources.length"></v-divider>
        <v-card-text v-if="!!props.sources && props.sources.length">
          <p class="text-body-2" v-for="s in props.sources">
            <strong>{{ Object.keys(s)[0] }}:</strong> {{ Object.values(s)[0] }}
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  left: Boolean,
  text: String,
  sources: Array,
})
</script>
