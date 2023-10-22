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
      <a-input-password
        placeholder="密码"
        v-model="password"
        :error="passwordError"
        allow-clear
      />
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
import { postRegister, postSendCaptcha } from '../../../services/user'
import { useRouter } from 'vue-router'
import { useConstStore } from '../../../store/const'

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
  emailError.value = !validateEmail(email.value)
  if (emailError.value) Message.error('请输入正确的邮箱')
  passwordError.value = !validateNotEmpty(password.value, '请输入密码')
  captchaError.value = !validateNotEmpty(captcha.value, '请输入验证码')
  console.log(emailError.value, passwordError.value, captchaError.value)
  if (emailError.value || passwordError.value || captchaError.value) return

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

function validateNotEmpty(str, error) {
  const f = str.length === 0
  if (f) {
    Message.error(error)
  }
  return !f
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}
</script>

<style scoped>
.form {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
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
