<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-icon role="img" size="200">
        mdi-book-open-page-variant
      </v-icon>
      <!-- <v-img contain height="100" src="@/assets/logo.svg" /> -->

      <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

      <h1 class="text-h2 font-weight-bold">ResearchGPT</h1>

      <div class="text-body-2 mt-4 mb-6">ResearchGPT employs OpenAI's cutting-edge technology to empower your research.
      </div>

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn color="primary" min-width="228" size="x-large" variant="flat" @click="handleClickSubmit">
            Start Exploring
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  <v-dialog max-width="40%" v-model="dialog" persistent>
    <v-card title="Please Provide Invitation Code">
      <v-card-text>
        <v-text-field v-model="accessKey" label="Input your invitation code..." required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="handleClickConfirm">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snackbar">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";

import { SaveAccessKey, PostAuthed } from "@/api/index"

const dialog = ref(false)
const snackbar = ref(false)
const snackbarText = ref("")
const accessKey = ref("")
const router = useRouter()

const handleClickSubmit = () => {
  dialog.value = true
}

const handleClickConfirm = async () => {
  try {
    const resp = await PostAuthed(accessKey.value)
  } catch (error) {
    console.log(error)
    snackbar.value = true
    snackbarText.value = error.toString()
    dialog.value = false
    return
  }

  SaveAccessKey(accessKey.value)
  dialog.value = false
  router.push({
    name: "Reading"
  })
}
</script>
