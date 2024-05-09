<template>
  <div id="register-form">
    <a-divider orientation="center">注册账号</a-divider>
    <div class="form">
      <a-input
        placeholder="邮箱"
        v-model="email"
        @input="changeEmail"
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
          密码至少有 6 个字符，并且需要包含大、小写字母以及数字或特殊字符
        </p>
      </div>
      <a-input
        placeholder="验证码"
        v-model="captcha"
        @input="changeCaptcha"
        allow-clear
      >
        <template #append>
          <button
            @click="sendCaptcha"
            :disabled="emailError !== false"
            id="btn-send-captcha"
            :class="{'btn-send-captcha-disabled': emailError !== false}"
          >
            {{ btnSendCaptchaText }}
          </button>
        </template>
      </a-input>
      <a-button
        type="primary"
        @click="register"
        :disabled="passwordError !== false || captchaError !== false || emailError !== false"
      >
        注册/登录
      </a-button>
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
const emailError = ref()
const passwordError = ref()
const captchaError = ref()

const btnSendCaptchaText = ref('发送验证码')

function register() {
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

function changeEmail() {
  emailError.value = !validateEmail(email.value)
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}

function changePassword() {
  passwordError.value = !validatePassword(password.value)
}

function validatePassword(password) {
  if (!password || password.length < 6) {
    return false
  }
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[~!?@#$%^&*_\-+=()[\]{}><\\/|"'.,:;]/.test(password)
  return hasUpperCase && hasLowerCase && (hasNumber || hasSpecialChar)
}

function changeCaptcha() {
  captchaError.value = captcha.value?.length !== 6
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
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  cursor: pointer;
}

#btn-send-captcha.btn-send-captcha-disabled {
  cursor: not-allowed;
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
