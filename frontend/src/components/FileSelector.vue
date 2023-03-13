<template>
  <v-container fluid class="pa-0 ma-0 fill-height" style="position: relative;">
    <v-overlay contained persistent v-model="overlay" class="align-center justify-center">
      <v-card style="padding: 1em; max-width: 400px;" title="Please Provide Your File">
        <v-card-item>
          <v-form ref="fileForm">
            <v-row no-gutters>
              <v-col cols="12">
                <p class="my-1 text-subtitle-1">Use an online PDF, </p>
                <v-text-field clearable :rules="fileURLRule" v-model="fileURL" prepend-icon="mdi-search-web"
                  label="Online PDF URL" color="primary" hint='The URL must end with ".pdf".'></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="my-1 text-subtitle-1">Or upload your own one: </p>
                <v-file-input clearable :rules="fileBlobListRule" v-model="fileBlobList" accept=".pdf"
                  label="Select Local File"></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-alert density="compact" variant="outlined" type="info" closable>
                  <strong>Note:</strong> This is a demo app. <br>
                  No files are stored on this server. <br>
                  The uploaded file will be processed in the browser, so please be patient when you upload a file.
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <v-btn :loading="submitLock" variant="elevated" color="primary" @click="handleClickSubmit">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-container>
  <v-snackbar v-model="snackbar">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue"
import { PostDownloadPDF, PostProcessPDF } from "@/api";

const emits = defineEmits(["onSelected"])
const submitLock = ref(false)
const overlay = ref(true)
const fileForm = ref(null)
const fileURL = ref("")
const fileBlobList = ref([])
const snackbar = ref(false)
const snackbarText = ref("")

const checkInput = (v1, v2) => (!!v1 || !!v2) && (!v1 || !v2)
const fileURLRule = [v => checkInput(v, fileBlobList.value.length) || "Either input a URL or upload a file.", v => !v || v.endsWith('.pdf') || 'You must enter a complete link with .pdf suffix.']
const fileBlobListRule = [v => checkInput(v.length, fileURL.value) || "Either input a URL or upload a file."]

const handleClickSubmit = async (e) => {
  const { valid } = await fileForm.value.validate()
  if (!valid)
    return

  submitLock.value = true
  if (fileBlobList.value.length) {
    const fileBlob = fileBlobList.value[0];

    try {
      const resp = await PostProcessPDF(fileBlob)
    } catch (error) {
      console.log(error)
      snackbar.value = true
      snackbarText.value = error.toString()
      submitLock.value = false
      return
    }

    emits("onSelected", URL.createObjectURL(fileBlob))
    overlay.value = !overlay.value
    submitLock.value = false
    return
  }

  try {
    const resp = await PostDownloadPDF(fileURL.value)
  } catch (error) {
    console.log(error)
    snackbar.value = true
    snackbarText.value = error.toString()
    submitLock.value = false
    return
  }

  emits("onSelected", fileURL.value)
  overlay.value = !overlay.value
  submitLock.value = false
}
</script>