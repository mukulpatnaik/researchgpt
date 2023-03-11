<template>
  <embed class="PDFEmbed" type="application/pdf" :src="props.file" />
</template>

<script setup>
const props = defineProps({
  file: String,
})
</script>

<style>
.PDFEmbed {
  padding-right: 8px;
  height: 100%;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>