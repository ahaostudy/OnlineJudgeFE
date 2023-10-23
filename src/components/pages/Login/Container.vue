<template>
  <div id="container">
    <div id="title">欢迎使用</div>
    <div id="form">
      <div v-if="form === 1">
        <LoginForm v-show="form === 1"></LoginForm>
      </div>
      <div v-else>
        <RegisterForm></RegisterForm>
      </div>
    </div>
    <div id="footer">
      <a-link @click="switchForm">{{ switchBtnText }}</a-link>
      <a-link v-show="form === 1">忘记密码</a-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const form = ref(1)
const switchBtnText = ref('注册账号')

function switchForm() {
  form.value = form.value === 1 ? 2 : 1
  switchBtnText.value = form.value === 1 ? '注册账号' : '密码登录'
}
</script>

<style scoped>
#container {
  text-align: center;
}

#title {
  font-size: 24px;
  text-align: center;
}

#form {
  padding-top: 15px;
}

#footer {
  display: flex;
  justify-content: space-between;
}
</style>
