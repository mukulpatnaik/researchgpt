<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-img contain height="100" src="@/assets/logo.svg" />

      <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

      <h1 class="text-h2 font-weight-bold">Research GPT</h1>

      <div class="text-body-2 ma-4">Research GPT employs OpenAI's cutting-edge technology to empower your research.</div>

      <div class="py-5" />

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
