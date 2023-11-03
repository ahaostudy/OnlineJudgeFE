<template>
  <div id="user-note-stats-container">
    <a-typography-title :heading="6"> 近期笔记 </a-typography-title>
    <a-timeline>
      <a-timeline-item v-for="note in notes" :key="note.id">
        {{ note.created_at }}
        <template #label>
          <a-typography-title :heading="6">
            <router-link :to="`/note/${note.id}`" class="note-title">
              {{ note.title }}
            </router-link>
          </a-typography-title>
          <a-typography-text type="secondary">
            <div class="note-content">
              {{ note.content }}
            </div>
          </a-typography-text>
        </template>
      </a-timeline-item>
      <a-timeline-item> </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { getNotes } from '../../../services/note'
import { useConstStore } from '../../../store/const'

const constStore = useConstStore()

const props = defineProps({
  user: {
    require: true,
    default: {
      id: 0
    }
  }
})

const notes = reactive([])

watch(
  () => props.user.id,
  (id) => {
    getNotes({ user_id: id }).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }

      for (const note of res.note_list) {
        const datetime = new Date(note.created_at)
        note.created_at = `${datetime.getFullYear()}-${String(
          datetime.getMonth() + 1
        ).padStart(2, '0')}-${String(datetime.getDate()).padStart(
          2,
          '0'
        )} ${datetime.toLocaleTimeString()}`
        notes.push(note)
      }
      console.log(notes)
    })
  }
)
</script>

<style scoped lang="less">
.note-title {
  font-weight: 500;
}

.note-content {
  padding-bottom: 24px;
}
</style>

<style>
#user-note-stats-container .arco-timeline-item-label {
  color: var(--color-text-1);
  font-size: 14px;
}
</style>
