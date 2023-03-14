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

      <div>
        <v-row justify="center" align="center" style="margin-bottom: 1.5%;">
          <v-col cols="12" md="4">
            <v-card>
              <v-icon>mdi-file</v-icon>
              <v-card-title>Example Queries</v-card-title>
              <v-card-text>
                What are the contributions from this paper?<br>
                What are the method used from this paper?<br>
                Give a summary of this paper<br>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-icon>mdi-lightbulb-on-10</v-icon>
              <v-card-title>Capabilities</v-card-title>
              <v-card-text>
                Understands the whole picture of a paper <br>
                Allows user to ask specific questions <br>
                Trained to decline irrelevant requests <br>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-icon>mdi-alert</v-icon>
              <v-card-title>Limitations</v-card-title>
              <v-card-text>
                May not handle very detail queries <br>
                May occasionally generate incorrect information <br>
                May not understand content other than research papers <br>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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

  <v-snackbar v-model="snackbar">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router";

const dialog = ref(false)
const snackbar = ref(false)
const snackbarText = ref("")
const router = useRouter()

const handleClickSubmit = () => {
  dialog.value = false
  router.push({
    name: "Reading"
  })
}

</script>
