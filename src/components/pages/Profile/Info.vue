<template>
  <div id="user-info-container">
    <div class="user-info">
      <div id="user-avatar">
        <Avatar
          :avatar="avatar"
          :name="props.user.nickname"
          :show-edit-button="true"
          @click-icon="showAvatarTrigger = true"
          :size="160"
        />
        <div class="user-avatar-trigger" v-show="showAvatarTrigger">
          <input
            type="file"
            id="file-input"
            @change="uploadAvatar"
            style="display: none"
          />
          <div @click="selectAvatar">上传头像</div>
          <!-- <div>删除头像</div> -->
        </div>
      </div>
      <div class="user-info-box">
        <div class="user-nickname">{{ props.user.nickname }}</div>
        <div class="user-relation">
          <div class="user-relation-item">
            <div>{{ 0 }}</div>
            <div>关注</div>
          </div>
          <div class="user-relation-item">
            <div>{{ 0 }}</div>
            <div>粉丝</div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-info-right">
      <a-popconfirm position="tr" @ok="updateName()">
        <template #icon>
          <div></div>
        </template>
        <template #content>
          <a-typography-title :heading="6"> 功能开发中 </a-typography-title>
          <div style="width: 260px">
            <a-input
              v-model="nickname"
              placeholder="暂时支持修改个人昵称"
              size="large"
            ></a-input>
          </div>
        </template>
        <a-button> <icon-edit />编辑 </a-button>
      </a-popconfirm>
    </div>
  </div>
</template>

<script setup>
import Avatar from '../../common/Avatar.vue'
import {
  avatarPath,
  putUpdateAvatar,
  putUpdateUser
} from '../../../services/user'
import { ref, watch, onMounted } from 'vue'
import { useAppStore } from '../../../store/app'
import { useConstStore } from '../../../store/const'
import { Message } from '@arco-design/web-vue'

const appStore = useAppStore()
const constStore = useConstStore()

const avatar = ref('')

const props = defineProps({
  user: {
    require: true,
    default: {
      id: 0,
      nickname: '',
      username: '',
      avatar: '',
      email: '',
      signature: ''
    }
  }
})

const showAvatarTrigger = ref(false)
function hideElement(event) {
  const elementToShow = document.getElementById('user-avatar')
  if (elementToShow && !elementToShow.contains(event.target)) {
    showAvatarTrigger.value = false
  }
}
onMounted(() => {
  window.addEventListener('click', hideElement)
})

function selectAvatar() {
  document.getElementById('file-input').click()
}
function uploadAvatar(event) {
  showAvatarTrigger.value = false
  if (event.target.files.length > 0) {
    const data = new FormData()
    data.append('avatar', event.target.files[0])
    putUpdateAvatar(data).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }

      Message.success('上传成功')
      location.reload()
    })
  }
}

const nickname = ref('')
function updateName() {
  putUpdateUser(appStore.user.id, {
    nickname: nickname.value
  }).then((res) => {
    if (res.status_code != constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    Message.success('更新成功')
    location.reload()
  })
}

watch(
  () => props.user.avatar,
  (newValue) => {
    avatar.value = avatarPath(newValue)
    nickname.value = props.user.nickname
  }
)
</script>

<style scoped lang="less">
#user-info-container {
  display: flex;
  justify-content: space-between;
}

.user-info {
  display: flex;
  gap: 50px;

  .user-info-box {
    display: flex;
    flex-direction: column;
    gap: 60px;
    justify-content: center;
  }

  #user-avatar {
    height: 160px;

    .user-avatar-trigger {
      position: relative;
      top: 15px;
      margin-left: 64px;

      display: inline-flex;
      flex-direction: column;
      padding: 8px;
      border-radius: 8px;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

      div {
        border-radius: 5px;
        padding: 4px 12px;
      }
      div:hover {
        background-color: #f0f0f0;
        cursor: pointer;
      }
    }
  }

  .user-nickname {
    font-size: 26px;
    font-weight: 600;
  }

  .user-relation {
    display: flex;
    gap: 20px;

    .user-relation-item {
      display: flex;
      gap: 8px;
    }
  }
}

.user-info-right {
  padding: 20px;
}
</style>
