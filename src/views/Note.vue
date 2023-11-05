<template>
  <div>
    <Navbar default="5"></Navbar>
    <Container>
      <div id="note-container">
        <div class="note-info-box">
          <div class="note-title">
            {{ note.title }}
            <div class="btns">
              <a-button type="text">
                <template #icon>
                  <icon-star :size="22" />
                </template>
              </a-button>
              <a-button type="text">
                <template #icon>
                  <icon-share-alt :size="22" />
                </template>
              </a-button>
              <a-popconfirm
                position="bottom"
                content="确认删除该笔记吗？删除后不可找回！"
                @ok="delNote"
              >
                <a-button type="text" v-if="appStore.user.id === note.user_id">
                  <template #icon>
                    <icon-delete :size="22" />
                  </template>
                </a-button>
              </a-popconfirm>
              <a-button
                type="outline"
                :href="`/note/editor/${id}`"
                v-if="appStore.user.id === note.user_id"
              >
                <div style="">编辑</div>
              </a-button>
            </div>
          </div>
          <div class="note-publish-info">
            <div
              class="note-publish-author"
              @click="router.push('/profile/' + author.username)"
            >
              <Avatar
                :avatar="avatarPath(author.avatar)"
                :name="author.nickname"
                :size="20"
              ></Avatar>
              <router-link :to="`/profile/${author.username}`">
                {{ author.nickname }}
              </router-link>
            </div>
            <div>发布于：{{ new Date(note.created_at).toLocaleString() }}</div>
            <router-link
              :to="`/problem/${note.problem_id}`"
              v-if="note.problem_id"
            >
              <a-tag color="arcoblue"> P{{ note.problem_id }} </a-tag>
            </router-link>
            <router-link
              :to="`/submit/${note.submit_id}`"
              v-if="note.submit_id"
            >
              <a-tag color="orangered"> S{{ note.submit_id }} </a-tag>
            </router-link>
          </div>
        </div>
        <v-md-preview :text="note.content"></v-md-preview>
      </div>
    </Container>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNote, deleteNote } from '../services/note'
import { useConstStore } from '../store/const'
import { Message } from '@arco-design/web-vue'
import Container from '../components/common/Container.vue'
import Avatar from '../components/common/Avatar.vue'
import { avatarPath } from '../services/user'
import { useAppStore } from '../store/app'

const route = useRoute()
const router = useRouter()
const constStore = useConstStore()
const appStore = useAppStore()

const id = ref(route.params.id)
const note = reactive({})
const author = reactive({
  nickname: '',
  avatar: ''
})

onMounted(() => {
  getNote(id.value).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    for (const key in res.note) {
      note[key] = res.note[key]
    }

    if (note.title === extractTitleFromMarkdown(getFirstLine(note.content))) {
      note.content = removeFirstLine(note.content)
    }

    for (const key in res.user) {
      author[key] = res.user[key]
    }
  })
})

function getFirstLine(text) {
  const newlineIndex = text.indexOf('\n')
  if (newlineIndex !== -1) return text.substring(0, newlineIndex)
  return text
}

function removeFirstLine(text) {
  let indexOfFirstNewline = text.indexOf('\n')
  if (indexOfFirstNewline !== -1) return text.substring(indexOfFirstNewline + 1)
  return text
}

function extractTitleFromMarkdown(text) {
  const match = text.match(/^#+\s*(.+)/)
  if (match) return match[1]
  return text
}

function delNote() {
  deleteNote(id.value).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    Message.success('删除成功')
    router.push('/notes')
  })
}
</script>

<style scoped>
#note-container {
  display: flex;
  flex-direction: column;
  margin: auto;

  .note-info-box {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 38px 20px;

    .note-publish-info {
      display: flex;
      align-items: center;
      gap: 10px;

      .note-publish-author {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;

        :hover {
          color: rgb(var(--primary-6));
        }
      }
    }

    .note-title {
      padding: 20px 0 20px;
      font-size: 34px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: start;

      .btns {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>

<style>
#note-container .github-markdown-body hr {
  height: 1px;
}

#note-container .arco-btn-size-medium {
  border-radius: 6px;
}

#note-container .arco-btn-outline {
  border-color: #508aff;
}

#note-container .github-markdown-body {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
