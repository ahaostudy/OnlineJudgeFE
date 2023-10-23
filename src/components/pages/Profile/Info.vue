<template>
  <div id="user-info-container">
    <div class="user-info">
      <div class="user-avatar">
        <Avatar
          :avatar="avatar"
          :name="props.user.nickname"
          :show-edit-button="true"
          @click-icon="updateAvatar"
          :size="160"
        />
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
      <a-popconfirm position="tr">
        <template #icon>
          <div></div>
        </template>
        <template #content>
          <a-typography-title :heading="6"> 功能开发中 </a-typography-title>
          <div style="width: 260px">
            <a-input placeholder="暂时支持修改个人昵称" size="large"></a-input>
          </div>
        </template>
        <a-button> <icon-edit />编辑 </a-button>
      </a-popconfirm>
    </div>
  </div>
</template>

<script setup>
import Avatar from '../../common/Avatar.vue'
import { avatarPath } from '../../../services/user'
import { ref, watch } from 'vue'

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

function updateAvatar() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'

  fileInput.onchange((event) => {
    console.log(event)
  })
}

watch(
  () => props.user.avatar,
  (newValue) => {
    avatar.value = avatarPath(newValue)
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
