<template>
  <v-row no-gutters :style='`margin: 15px 0; justify-content: ${props.left ? "flex-begin" : "flex-end"};`'>
    <v-col cols="auto" style="max-width: 90%">
      <v-card :style="`border-radius: 15px 15px ${props.left ? '15px 0' : '0 15px'};`" elevation="2" density="compact"
        :color='props.left ? "white" : "primary"'>
        <v-card-text>
          {{ props.text }}
        </v-card-text>
        <v-divider v-if="!!props.source"></v-divider>
        <v-card-text v-if="!!props.source">
          {{ JSON.stringify(props.source) }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  left: Boolean,
  text: String,
  source: Object,
})

</script>
