<template>
  <div id="admin-testcase">
    <div id="form">
      输入
      <a-textarea v-model="input" placeholder="样例输入" auto-size></a-textarea>
      输出
      <a-textarea
        v-model="output"
        placeholder="样例输出"
        auto-size
      ></a-textarea>
      题目
      <a-input-number v-model="problemID"></a-input-number>
      <a-button type="primary" @click="createTestcase">添 加</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser } from '../services/user'
import { postCreateTestcase } from '../services/problem'
import { useConstStore } from '../store/const'

const router = useRouter()
const constStore = useConstStore()

const input = ref('')
const output = ref('')
const problemID = ref(0)

getUser(-1).then((res) => {
  if (res.status_code !== constStore.CodeSuccess.code || res.user.role !== 1) {
    router.back()
  }
})

function createTestcase() {
  postCreateTestcase(problemID.value, input.value, output.value).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }
    Message.success(res.status_msg)
  })
}
</script>

<style scoped>
#admin-testcase {
  display: flex;
  justify-content: center;
}

#form {
  flex: 1;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
