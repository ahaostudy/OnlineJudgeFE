<template>
  <div id="work-container">
    <a-tabs v-model:active-key="activeKey">
      <a-tab-pane key="1">
        <template #title> <icon-code /> 代码 </template>

        <Buttons
          @debug="debug"
          @submit="submit"
          :id="props.id"
          v-model:language="language"
          @update:language="chagneLanguage"
        >
        </Buttons>
        <Editor
          :language="constStore.LanguageSuffixs[language - 1]"
          @change="changeCode"
          v-model="code"
        >
        </Editor>
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #title> <icon-check-square /> 测试样例 </template>
        <Buttons
          @debug="debug"
          @submit="submit"
          :id="props.id"
          v-model:language="language"
          @update:language="chagneLanguage"
        >
        </Buttons>
        <Console
          v-model:problem="props.problem"
          v-model:sample="sample"
          :status="status"
          :stdout="stdout"
        >
        </Console>
      </a-tab-pane>
      <a-tab-pane key="3" :style="{ overflowY: 'auto' }">
        <template #title> <icon-history /> 提交记录 </template>
        <Submits :id="props.id"></Submits>
      </a-tab-pane>
    </a-tabs>
    <a-button
      type="primary"
      :shape="popup ? 'round' : 'circle'"
      class="button-trigger"
      v-on:mouseenter="popup = !popup"
      v-on:mouseleave="popup = !popup"
      @click="showGPT = true"
    >
      <icon-robot size="18px" />{{ popup ? '&nbsp;智能助手' : '' }}
    </a-button>
    <a-drawer
      :width="'32%'"
      :visible="showGPT"
      @cancel="showGPT = false"
      :footer="false"
      unmountOnClose
    >
      <template #title>
        <a-typography-title :heading="6">
          <icon-robot /> 智能助手
        </a-typography-title>
      </template>
      <Chat :code="code" :problem="props.problem"></Chat>
    </a-drawer>
  </div>
</template>

<script setup>
import Editor from './Editor.vue'
import Console from './Console.vue'
import Buttons from './Buttons.vue'
import { ref } from 'vue'
import { postDebug, postSubmit, postGetResult } from '../../../services/submit'
import { useConstStore } from '../../../store/const'
import { Message, Notification } from '@arco-design/web-vue'
import Submits from './Submits.vue'
import Chat from './Chat.vue'

const props = defineProps({
  id: { require: true },
  problem: { require: true }
})
const constStore = useConstStore()

const activeKey = ref('1')
const language = ref(Number(localStorage.getItem(`language`)) || 1)
const sample = ref(0)
const code = ref(
  localStorage.getItem(`code-${props.id}-${language.value}`) || ''
)
const popup = ref(false)
const showGPT = ref(false)

// 实时保存代码
function changeCode(val) {
  localStorage.setItem(`code-${props.id}-${language.value}`, val)
}

// 切换语言
function chagneLanguage(value) {
  code.value = localStorage.getItem(`code-${props.id}-${value}`) || ''
  localStorage.setItem(`language`, value)
}

// 调试代码
function debug() {
  activeKey.value = '2'

  for (let i = 0; i < props.problem.samples.length; i++) {
    props.problem.status[i] = constStore.StatusRunning
    props.problem.stdouts[i] = ''

    const input = props.problem.samples[i].input

    postDebug(code.value, input, language.value).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        props.problem.status[i] = constStore.StatusServerFailed
        return
      }
      props.problem.samples[i].output = res.result.output
      props.problem.status[i] = res.result.status
      const status = res.result.status
      if (
        status !== constStore.StatusAccepted &&
        status !== constStore.StatusFinished
      ) {
        props.problem.stdouts[i] = res.result.error
      } else {
        props.problem.stdouts[i] = `执行时间：${
          res.result.time
        } ms  执行内存：${res.result.memory / 1024 / 1024} MB`
      }
    })
  }
}

// 提交代码
function submit() {
  activeKey.value = '2'
  props.problem.status[sample.value] = constStore.StatusRunning
  props.problem.stdouts[sample.value] = ''

  postSubmit(props.id, code.value, language.value).then((response) => {
    if (response.status_code !== constStore.CodeSuccess.code) {
      Message.error(response.status_msg)
      return
    }

    let maxCount = 8
    let interval = 100

    const exec = () => {
      if (maxCount === 0) {
        return
      }

      maxCount--
      postGetResult(response.submit_id).then((res) => {
        if (res.status_code !== constStore.CodeSuccess.code) {
          Message.error(res.status_msg)
        } else if (res.result.status === constStore.StatusRunning) {
          console.log('running_' + (8 - maxCount))
          interval *= 1.5
          setTimeout(exec, interval)
        } else {
          props.problem.status[sample.value] = res.result.status
          const status = res.result.status
          if (
            status !== constStore.StatusAccepted &&
            status !== constStore.StatusFinished
          ) {
            props.problem.stdouts[sample.value] = res.result.error
          } else {
            props.problem.stdouts[sample.value] = `最大执行时间：${
              res.result.time
            } ms  最大执行内存：${res.result.memory / 1024 / 1024} MB`
          }
          Notification[constStore.GetStatus(status).type]({
            title: constStore.GetStatus(status).status,
            closable: true
          })
        }
      })
    }

    setTimeout(exec, interval)
  })
}
</script>

<style scoped lang="less">
#work-container {
  height: 100%;
}

.button-trigger {
  position: absolute;
  right: 80px;
  bottom: 80px;
  cursor: pointer;
  transition: all 0.1s;
}
</style>

<style>
#work-container .arco-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#work-container .arco-tabs-content,
#work-container .arco-tabs-content-list,
#work-container .arco-tabs-content-item,
#work-container .arco-tabs-pane {
  padding: 0;
  height: 100%;
}
</style>
