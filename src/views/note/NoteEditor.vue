<template>
  <div id="note-editor-container">
    <div class="header">
      <a-typography-title :heading="5">
        <Logo to="/notes" style="margin: 0 20px"></Logo>
        <a-tooltip v-if="!editingTitle" content="双击可更新标题">
          <div @dblclick="editTitle" class="title">
            {{ title }}
          </div>
        </a-tooltip>
        <a-space v-else>
          <a-input v-model="bakTitle" />
          <a-button
            shape="circle"
            style="height: 30px; width: 30px"
            @click="quitTitle"
          >
            <template #icon>
              <icon-close :size="12" />
            </template>
          </a-button>
          <a-button
            type="primary"
            shape="circle"
            style="height: 30px; width: 30px"
            @click="saveTitle"
          >
            <template #icon>
              <icon-check />
            </template>
          </a-button>
        </a-space>
      </a-typography-title>
      <div class="header-btns">
        <a-button @click="quit"> 退出编辑 </a-button>
        <a-button type="primary" @click="save">
          <template #icon>
            <icon-save />
          </template>
          保存笔记
        </a-button>
      </div>
    </div>
    <div class="editor-box">
      <v-md-editor class="editor" v-model="content" :default-show-toc="true" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Logo from '@/components/common/Logo.vue'
import { useRoute, useRouter } from 'vue-router'
import { getNote, postCreateNote, putUpdateNote } from '@/services/note'
import { useConstStore } from '@/store/const'
import { Message } from '@arco-design/web-vue'
import { useAppStore } from '@/store/app'

const route = useRoute()
const router = useRouter()
const constStore = useConstStore()
const appStore = useAppStore()

const id = ref(route.params.id)
const title = ref('无标题')
const editingTitle = ref(false)
const content = ref('')

if (id.value) {
  getNote(id.value).then((res) => {
    ;(title.value = res.note.title), (content.value = res.note.content)
  })
}

function getFirstLine(text) {
  const newlineIndex = text.indexOf('\n')
  if (newlineIndex !== -1) return text.substring(0, newlineIndex)
  return text
}

function extractTitleFromMarkdown(text) {
  const match = text.match(/^#+\s*(.+)/)
  if (match) return match[1]
  return '无标题'
}

watch(
  () => content.value,
  (newVal, oldVal) => {
    const newFirstLine = getFirstLine(newVal)
    const oldFirstLine = getFirstLine(oldVal)
    const newTitle = extractTitleFromMarkdown(newFirstLine)
    const oldTitle = extractTitleFromMarkdown(oldFirstLine)
    if (
      title.value === '' ||
      (title.value === oldTitle && newTitle !== oldTitle)
    ) {
      title.value = newTitle
    }
  }
)

function save() {
  if (!id.value) {
    postCreateNote(title.value, content.value).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }
      // TODO: 保存题目后应该返回题目id，这样才能跳转
      quit()
    })
  } else {
    putUpdateNote(id.value, title.value, content.value).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }
      quit()
    })
  }
}

function quit() {
  if (id.value) router.push('/note/' + id.value)
  else router.back()
}

const bakTitle = ref('')
function editTitle() {
  editingTitle.value = true
  bakTitle.value = title.value
}

function quitTitle() {
  editingTitle.value = false
}

function saveTitle() {
  if (id.value) {
    putUpdateNote(id.value, bakTitle.value).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }
      title.value = bakTitle.value
      editingTitle.value = false
      Message.success('已更新')
    })
  } else {
    title.value = bakTitle.value
    editingTitle.value = false
  }
}
</script>

<style scoped lang="less">
#note-editor-container {
  height: 100vh;

  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 20px 0 10px;

    .header-btns {
      display: flex;
      gap: 10px;
    }

    .title {
      user-select: none;
      cursor: text;
    }
  }

  .editor-box {
    display: flex;
    flex: 1;

    .editor {
      flex: 1;
    }
  }
}
</style>

<style>
#note-editor-container h5.arco-typography {
  margin: 1em 0;
  display: flex;
  align-items: center;
}
</style>
