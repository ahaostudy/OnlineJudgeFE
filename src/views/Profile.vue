<template>
  <div>
    <Navbar :default="'0'"></Navbar>
    <Container>
      <div id="profile-container">
        <div class="user-info">
          <Info :user="user" />
        </div>
        <div class="user-description">
          <Description :user="user" />
        </div>
        <div class="user-stats">
          <!-- 热力图 -->
          <div class="submit-records">
            <SubmitStats :user="user" />
          </div>
          <!-- 时间轴 -->
          <div class="note-records">
            <NoteStats :user="user" />
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '../services/user'
import { useConstStore } from '../store/const'
import { Message } from '@arco-design/web-vue'
import Container from '../components/common/Container.vue'
import Info from '../components/pages/Profile/Info.vue'
import SubmitStats from '../components/pages/Profile/SubmitStats.vue'
import NoteStats from '../components/pages/Profile/NoteStats.vue'
import Description from '../components/pages/Profile/Description.vue'

const route = useRoute()
const constStore = useConstStore()
const user = reactive({})

const username = ref(route.params.username)

// TODO: 通过用户名获取用户信息
getUser(0, username.value).then((res) => {
  if (res.status_code !== constStore.CodeSuccess.code) {
    Message.error(res.status_msg)
    return
  }
  console.log(res);
  for (let key in res.user) {
    user[key] = res.user[key]
  }
})
</script>

<style scoped lang="less">
#profile-container {
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-top: 40px;

  .user-stats {
    display: flex;
    flex-direction: column;
    gap: 50px;
  }
}
</style>
