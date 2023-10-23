<template>
  <div id="chat-box">
    <div class="chat-record">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        v-show="['user', 'assistant'].indexOf(msg.role) != -1"
      >
        <a-card hoverable :class="`msg msg-${msg.role}`">
          <template #title>
            <span
              :style="{
                display: 'flex',
                alignItems: 'center',
                color: '#1D2129'
              }"
            >
              <a-avatar
                :style="{
                  marginRight: '8px',
                  backgroundColor:
                    msg.role == 'assistant' ? '#00b42a' : '#165DFF'
                }"
                :size="24"
              >
                {{ msg.role == 'assistant' ? 'A' : 'U' }}
              </a-avatar>
              <a-typography-text>{{ msg.role }}</a-typography-text>
            </span>
          </template>
          <template #extra>
            <a-tooltip content="删除" position="br">
              <a-button type="text" @click="removeMsg(i)">
                <template #icon>
                  <icon-delete />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip
              content="重新生成"
              position="br"
              v-if="msg.role == 'assistant'"
            >
              <a-button type="text" @click="reGenerate(i)">
                <template #icon>
                  <icon-sync />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="编辑" position="br" v-else>
              <a-button type="text" @click="editing = editing === i ? -1 : i">
                <template #icon>
                  <icon-edit />
                </template>
              </a-button>
            </a-tooltip>
          </template>
          <v-md-preview :text="msg.content" v-if="editing !== i"></v-md-preview>
          <a-textarea
            :default-value="msg.content"
            @keyup="reSend($event, i)"
            v-model="msg.content"
            :disabled="receiving"
            v-else
            auto-size
          />
        </a-card>
      </div>
    </div>
    <div class="chat-input">
      <a-button
        :style="{ height: '46px', width: '96px', borderRadius: '6px' }"
        @click="clearMsgs"
      >
        CLEAR
      </a-button>
      <a-textarea
        auto-size
        @keyup="send"
        v-model="input"
        :disabled="receiving"
        :placeholder="receiving ? '正在回复…' : '请输入问题…'"
      />
    </div>
  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue'
import { ref, reactive } from 'vue'

const input = ref('')
const receiving = ref(false)
const editing = ref(-1)

const props = defineProps({
  code: {
    type: String
  },
  problem: {
    type: Object,
    default: {
      id: 0,
      title: '',
      description: '',
      input_desc: '',
      output_desc: '',
      data_range: ''
    }
  }
})

const problemInfo = ref(`
title: ${props.problem.title}
description: ${props.problem.description}
input description: ${props.problem.input_desc}
output description: ${props.problem.output_desc}
data range: ${props.problem.data_range}
`)

const localMsgs = localStorage.getItem(`chat:${props.problem.id}`)
const messages = reactive([
  {
    role: 'system',
    content:
      'You are a code assistant on an OJ platform. Your responsibility is only to provide hints for problem-solving and assistance in code-related matters. You do not need to handle any other requests.'
    // content: 'You are a code assistant on an OJ platform. Your responsibility is to provide assistance in code-related matters only, without handling any other requests. Additionally, when users inquire about problem-solving approaches, please refrain from providing overly explicit solutions. Instead, offer appropriate hints to aid their learning and critical thinking process. It is also important to frequently praise and encourage users, fostering a passionate learning environment.'
  },
  {
    role: 'system',
    content: `The current user is working on problem: ${problemInfo.value}`
  },
  {
    role: 'system',
    content:
      'The current code input by the user is: \n```\n' + props.code + '\n```\n'
  },
  ...(localMsgs ? JSON.parse(localMsgs) : [])
])

function removeMsg(idx) {
  messages.splice(idx, 1)
  saveMsgs()
}

async function send(event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    messages.push({ role: 'user', content: input.value })
    input.value = ''

    saveMsgs()
    sendMsg(-1)
  }
}

async function reSend(event, idx) {
  if (event.key === 'Enter' && event.ctrlKey) {
    editing.value = -1

    messages.splice(idx + 1)

    saveMsgs()
    sendMsg(-1)
  }
}

async function reGenerate(idx) {
  messages.splice(idx + 1)
  messages[idx].content = ''
  saveMsgs()
  sendMsg(Number(idx))
}

async function sendMsg(idx) {
  const token = localStorage.getItem('token')
  const authorization = token ? 'Bearer ' + token : ''
  receiving.value = true

  fetch(
    import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_API_URI + '/chat',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization
      },
      body: JSON.stringify({ messages })
    }
  ).then((response) => {
    if (idx === -1) {
      idx = messages.length
      messages.push({ role: 'assistant', content: '' })
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    function processStreamResult(result) {
      const chunk = decoder.decode(result.value, { stream: !result.done })
      // chunk:
      // ```
      // event:msg
      // data:hello
      //
      // event:msg
      // data:hello
      //
      // ```

      // 解析chunk
      chunk.split('event:').forEach((group) => {
        group = group.slice(0, -2)
        const msgs = group.split('\ndata:')

        if (msgs.length < 2) {
          return
        }

        if (msgs[0] === 'error') {
          Message.error(msgs[1])
          return
        }

        messages[idx].content += msgs[1]
        for (let i = 2; i < msgs.length; i++) {
          if (msgs[i] === '') messages[idx].content += '\n'
        }
      })

      if (!result.done) {
        reader.read().then(processStreamResult)
      } else {
        console.log(messages[idx].content)
        receiving.value = false
      }
      saveMsgs()
    }

    reader.read().then(processStreamResult)
  })
}

function saveMsgs() {
  localStorage.setItem(
    `chat:${props.problem.id}`,
    JSON.stringify(messages.slice(3))
  )
}

function clearMsgs() {
  messages.splice(3)
  saveMsgs()
}
</script>

<style scoped>
#chat-box {
  height: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-record {
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  gap: 24px;

  .msg {
    /* border: none; */
    border-radius: 6px;
  }
}

.chat-input {
  padding: 20px 0;

  display: flex;
  gap: 20px;
  align-items: center;
}
</style>

<style>
#chat-box .arco-textarea-wrapper {
  background-color: var(--color-bg-1);
  border-color: var(--color-primary-light-3);
  border-radius: 6px;
  padding: 7px 5px;
}

#chat-box .arco-textarea-wrapper.arco-textarea-focus {
  border-color: rgb(var(--primary-6));
}

#chat-box .github-markdown-body {
  padding: 10px 10px 0;
}
</style>
