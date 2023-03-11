<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-icon role="img" size="200">
        mdi-book-open-page-variant
      </v-icon>
      <!-- <v-img contain height="100" src="@/assets/logo.svg" /> -->

      <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

      <h1 class="text-h2 font-weight-bold">ResearchGPT</h1>

      <div class="text-body-2 mt-4 mb-6">ResearchGPT employs OpenAI's cutting-edge technology to empower your research.</div>

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn color="primary" min-width="228" size="x-large" variant="flat" @click="$router.push({ name: 'Reading' })">
            Start Exploring
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
</script>
