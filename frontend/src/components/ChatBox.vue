<template>
  <v-container class="ma-0 pa-0 fill-height flex-column flex-nowrap">
    <v-container class="pa-2 h-0 flex-grow-1 overflow-y-auto">
      <MessageLine v-for="msg in msgHistory" :id="msg.id" :left="msg.left" :text="msg.text" :sources="msg.sources"></MessageLine>
    </v-container>
    <v-divider></v-divider>
    <v-card :disabled="props.disableChat" style="height: 200px" elevation="4" color="surface" class="w-100" rounded="0">
      <v-toolbar color="surface" density="compact" rounded="0">
        <v-btn size="small" prepend-icon="mdi-swap-horizontal" @click="handleClickChangeFile">
          Change File
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn size="small" prepend-icon="mdi-trash-can" @click="handleClickClear">
          Clear
        </v-btn>
        <v-btn :loading="sendLock" size="small" prepend-icon="mdi-send" @click="handleClickSend">
          Send
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-textarea style="margin-left: 0.8em;" v-model="msgToSend" no-resize density="compact" variant="plain"
        placeholder="Ask anything about the file...">
      </v-textarea>
    </v-card>
  </v-container>
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-text>
        {{ dialogText }}
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="dialog = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import MessageLine from "./MessageLine.vue"
import { ref } from "vue"
import { PostChatReply } from "@/api/index"

const emits = defineEmits(["onChangeFile"])
const props = defineProps({ disableChat: Boolean })
const dialog = ref(false)
const dialogText = ref("")
const sendLock = ref(false)
const msgToSend = ref("")
const msgHistory = ref([])

const initializeHistory = () => {
  msgHistory.value = [{
    id: 0,
    left: true,
    text: "Hi! What can I do for you today😋?",
    sources: null,
  }]
}

const handleClickChangeFile = async () => {
  emits("onChangeFile")
  initializeHistory()
  msgToSend.value = ""
}

const handleClickSend = async () => {
  msgHistory.value.push({
    id: msgHistory.value.length,
    left: false,
    text: msgToSend.value,
  })
  
  const msg = msgToSend.value
  msgToSend.value = ""

  try {
    sendLock.value = true
    const reply = await PostChatReply(msg)
    console.log(reply)

    msgHistory.value.push({
      id: msgHistory.value.length,
      left: true,
      text: reply["answer"],
      sources: reply["sources"]
    })
  } catch (e) {
    console.log(e)
    dialogText.value = "Request for OpenAI failed. This may be caused by unsupported file content or network failure. Please try again."
    dialog.value = true
  }

  sendLock.value = false
}

const handleClickClear = async () => {
  msgToSend.value = ""
}

initializeHistory()
</script>

<style>
/* Works on Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #2196f3 #e0e0e0;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-track {
  background: #e0e0e0;
}

*::-webkit-scrollbar-thumb {
  background-color: grey;
  border-radius: 6px;
}
</style>