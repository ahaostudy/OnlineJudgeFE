<template>
  <div id="register-form">
    <a-divider orientation="center">注册账号</a-divider>
    <div class="form">
      <a-input
        placeholder="邮箱"
        v-model="email"
        :error="emailError"
        allow-clear
      />
      <div>
        <a-input-password
          placeholder="密码"
          v-model="password"
          :error="passwordError"
          @input="changePassword"
          allow-clear
        />
        <p
          v-show="passwordError"
          class="password-tips"
        >
          密码长度不小于 8 位，且必须包含数字和字母
        </p>
      </div>
      <a-input
        placeholder="验证码"
        v-model="captcha"
        :error="captchaError"
        allow-clear
      >
        <template #append>
          <div @click="sendCaptcha" id="btn-send-captcha">
            {{ btnSendCaptchaText }}
          </div>
        </template>
      </a-input>
      <a-button type="primary" @click="register">注册/登录</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { postRegister, postSendCaptcha } from '@/services/user'
import { useRouter } from 'vue-router'
import { useConstStore } from '@/store/const'

const router = useRouter()
const constStore = useConstStore()

const email = ref('')
const password = ref('')
const captcha = ref('')
const emailError = ref(false)
const passwordError = ref(false)
const captchaError = ref(false)

const btnSendCaptchaText = ref('发送验证码')

function register() {
  // 输入校验
  // email
  emailError.value = !validateEmail(email.value)
  if (emailError.value) Message.error('请输入格式正确的邮箱')
  // password
  // if (passwordError.value) Message.error('请输入格式正确的密码')
  // captcha
  captchaError.value = !captcha.value || captcha.value.length === 0
  if (captchaError.value) Message.error('请输入验证码')
  // if (emailError.value || passwordError.value || captchaError.value) return

  postRegister(email.value, password.value, captcha.value).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
    } else {
      localStorage.setItem('token', res.token)
      router.push('/')
    }
  })
}

function sendCaptcha() {
  if (btnSendCaptchaText.value !== '发送验证码') {
    return
  }
  if (validateEmail(email.value) === false) {
    Message.error('请输入邮箱')
    emailError.value = true
    return
  }
  emailError.value = false
  btnSendCaptchaText.value = 60
  const interval = setInterval(() => {
    if (btnSendCaptchaText.value === 0) {
      btnSendCaptchaText.value = '发送验证码'
      clearInterval(interval)
    } else {
      btnSendCaptchaText.value--
    }
  }, 1000)
  postSendCaptcha(email.value).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
    } else {
      Message.success('已发送邮箱验证码')
    }
  })
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}

function changePassword() {
  passwordError.value = !validatePassword(password.value)
}

function validatePassword(password) {
  if (!password || password.length < 8 || password >= 128) return false;
  let letter = false, number = false;
  for (let c of password) {
    if (c >= 'a' && c <= 'z') letter = true;
    else if (c >= 'A' && c <= 'Z') letter = true;
    else if (c >= '0' && c <= '9') number = true;
  }
  return letter && number;
}
</script>

<style scoped>
.form {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;

  .password-tips {
    color: red;
    font-size: 12px;
    text-align: start;

    height: 37px;
    width: 125%;
    margin: 2px 0 -39px 0;
    transform: scale(0.8);
    transform-origin: left top;
  }
}

#btn-send-captcha {
  font-size: 12px;
}

#btn-send-captcha:hover {
  color: #666;
  cursor: pointer;
}
</style>

<style>
#register-form .arco-tabs-tab {
  margin: 0 40px;
}

#register-form .arco-tabs-nav-tab {
  justify-content: center;
}

#register-form .arco-tabs-nav-ink {
  display: none;
}
</style>
