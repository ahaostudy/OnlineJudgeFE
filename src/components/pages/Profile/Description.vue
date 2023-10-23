<template>
  <div @mouseover="hover = true" @mouseleave="hover = false">
    <div class="btn-edit">
      <a-button shape="circle" v-if="hover && !editing" @click="editing = true">
        <icon-edit />
      </a-button>
      <a-button shape="circle" v-if="editing" @click="editing = false">
        <icon-close />
      </a-button>
      <a-button
        shape="circle"
        type="primary"
        v-if="editing"
        @click="saveSignature"
      >
        <icon-save />
      </a-button>
    </div>
    <div
      id="user-description"
      :class="{ 'user-description-hover': hover && !editing }"
    >
      <v-md-editor v-model="props.user.signature" v-if="editing" />
      <v-md-preview :text="props.user.signature" v-else />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { putUpdateUser } from '../../../services/user'
import { useAppStore } from '../../../store/app'
import { useConstStore } from '../../../store/const'
import { Message } from '@arco-design/web-vue'

const appStore = useAppStore()
const constStore = useConstStore()

const props = defineProps({
  user: {
    require: true,
    default: {
      signature: ''
    }
  }
})

const hover = ref(false)
const editing = ref(false)

function saveSignature() {
  putUpdateUser(appStore.user.id, {
    signature: props.user.signature
  }).then((res) => {
    if (res.status_code != constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }
    Message.success('更新成功')
    editing.value = false
  })
}
</script>

<style scoped lang="less">
.btn-edit {
  display: flex;
  justify-content: end;
  gap: 10px;

  position: relative;
  height: 0;
  top: 8px;
}

#user-description {
  margin-top: 45px;
  transition: box-shadow 0.3s ease-in-out;
}

.user-description-hover {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>

<style>
#user-description .github-markdown-body {
  padding: 20px 12px 0;
}
</style>
