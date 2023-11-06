<template>
  <div>
    <Navbar default="0" />
    <Container>
      <div id="submit-container">
        <div class="problem-box">
          <a-typography-title :heading="3"> 提交记录 </a-typography-title>
        </div>
        <div class="submit-base-info">
          <div class="user-box">
            <Avatar :avatar="avatarPath(user.avatar)" :name="user.nickname" />
            <router-link :to="`/profile/${user.username}`">
              {{ user.nickname }}
            </router-link>
          </div>
          <div>提交于：{{ new Date(submit.created_at).toLocaleString() }}</div>
          <router-link
            :to="`/problem/${submit.problem_id}`"
            v-if="submit.problem_id"
          >
            <a-tag color="arcoblue"> P{{ submit.problem_id }} </a-tag>
          </router-link>
          <router-link :to="`/note/${submit.note_id}`" v-if="submit.note_id">
            <a-tag color="purple"> N{{ submit.note_id }} </a-tag>
          </router-link>
        </div>
        <v-md-preview :text="submitInfo" />
      </div>
    </Container>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getSubmit } from '../services/submit'
import { useConstStore } from '../store/const'
import { Message } from '@arco-design/web-vue'
import Container from '../components/common/Container.vue'
import Avatar from '../components/common/Avatar.vue'
import { avatarPath, getUser } from '../services/user'
import { getProblem } from '../services/problem'

const route = useRoute()
const constStore = useConstStore()

const id = ref(route.params.id)
const submit = reactive({})
const user = reactive({
  avatar: ''
})
const problem = reactive({
  title: ''
})
const submitInfo = ref('')

getSubmit(id.value).then((res) => {
  if (res.status_code !== constStore.CodeSuccess.code) {
    Message.error(res.status_msg)
    return
  }

  for (const key in res.submit) {
    submit[key] = res.submit[key]
  }

  submitInfo.value =
    `## ${constStore.GetStatus(submit.status).status}\n\n` +
    `执行用时：${submit.time} ms &nbsp;&nbsp;&nbsp; 执行内存：${
      submit.memory / 1024 / 1024
    } MB\n\n` +
    `### ${constStore.Languages[submit.lang_id - 1]}\n\n` +
    '``` ' +
    constStore.LanguageSuffixs[submit.lang_id - 1] +
    '\n' +
    `${submit.code}\n` +
    '```\n'

  getUser(res.submit.user_id).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    for (const key in res.user) {
      user[key] = res.user[key]
    }
  })

  getProblem(res.submit.problem_id).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    for (const key in res.problem) {
      problem[key] = res.problem[key]
    }
  })
})
</script>

<style scoped lang="less">
#submit-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 20px;

  .submit-base-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .user-box {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;

      :hover {
        color: rgb(var(--primary-6));
      }
    }
  }
}
</style>

<style>
#submit-container .github-markdown-body {
  padding: 0px;
}
</style>
