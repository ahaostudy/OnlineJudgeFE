<template>
  <div id="note-list-container">
    <div class="note-card" v-for="note in notes" :key="note.id">
      <div class="note-card-top">
        <Avatar
          :size="24"
          :avatar="avatarPath(note.author.avatar)"
          :name="note.author.nickname"
        ></Avatar>
        <div class="note-card-top-name">
          <router-link :to="'/profile/' + note.author.username">
            {{ note.author.nickname }}
          </router-link>
        </div>
      </div>
      <div class="note-card-body">
        <div class="note-card-body-title">
          <router-link :to="`/note/${note.id}`">
            {{ note.title }}
          </router-link>
        </div>
        <div class="note-card-body-content">
          {{
            note.content
              .replace('[//]: # (笔记填到此处嗷~)', '')
              .replace('[//]: # (笔记_END)', '')
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getNotes } from '../../../services/note'
import { useConstStore } from '../../../store/const'
import { Message } from '@arco-design/web-vue'
import { avatarPath } from '../../../services/user'
import Avatar from '../../common/Avatar.vue'

const router = useRouter()
const constStore = useConstStore()

const notes = reactive([])

onMounted(() => {
  getNotes().then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    for (let note of res.note_list) {
      notes.push(note)
    }
  })
})
</script>

<style scoped lang="less">
#note-list-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.note-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid var(--color-neutral-2);

  .note-card-top {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    .note-card-top-name {
      color: var(--color-neutral-8);
    }
    :hover {
      color: rgb(var(--primary-6));
    }
  }

  .note-card-body {
    display: flex;
    flex-direction: column;
    margin-left: 24px;
    padding: 10px;
    gap: 6px;

    .note-card-body-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 12px;
    }
    .note-card-body-title:hover {
      cursor: pointer;
      color: rgb(var(--primary-6));
    }

    .note-card-body-content {
      color: var(--color-neutral-8);
      padding-bottom: 10px;
    }
  }
}
</style>
