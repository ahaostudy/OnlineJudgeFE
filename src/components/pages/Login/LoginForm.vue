<template>
    <div id="login-form">
        <a-tabs default-active-key="1" v-model:active-key="activeKey">
            <a-tab-pane key="1" title="密码登录">
                <div class="form">
                    <a-input placeholder="账号或邮箱" v-model="username" :error="usernameError" allow-clear />
                    <a-input-password placeholder="密码" v-model="password" :error="passwordError" allow-clear />
                    <a-button type="primary" @click="login">登 录</a-button>
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" title="邮箱登录">
                <div class="form">
                    <a-input placeholder="邮箱" v-model="email" :error="emailError" allow-clear />
                    <a-input placeholder="验证码" v-model="captcha" :error="captchaError" allow-clear>
                        <template #append>
                            <div @click="sendCaptcha" id="btn-send-captcha">{{ btnSendCaptchaText }}</div>
                        </template>
                    </a-input>
                    <a-button type="primary" @click="login">登 录</a-button>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { postLoginByPassword, postLoginByEmail, postSendCaptcha } from '../../../services/user';
import { useRouter } from 'vue-router';
import { useConstStore } from '../../../store/const';
import { useAuthStore } from '../../../store/auth';

const router = useRouter();
const constStore = useConstStore()
const authStore = useAuthStore()

const activeKey = ref('1')
const username = ref('')
const password = ref('')
const email = ref('')
const captcha = ref('')
const usernameError = ref(false)
const passwordError = ref(false)
const emailError = ref(false)
const captchaError = ref(false)

const btnSendCaptchaText = ref('发送验证码')

function login() {
    let token = '';
    if (activeKey.value === '1') {
        // 输入校验
        usernameError.value = !validateNotEmpty(username.value, '请输入账号')
        passwordError.value = !validateNotEmpty(password.value, '请输入密码')
        if (usernameError.value || passwordError.value) return

        postLoginByPassword(username.value, password.value).then(res => {
            if (res.status_code !== constStore.CodeSuccess.code) {
                Message.error(res.status_msg)
            } else {
                token = res.token
                authStore.token = res.token
                localStorage.setItem('token', res.token)
                router.push('/')
            }
        })
    } else if (activeKey.value === '2') {
        // 输入校验
        emailError.value = !validateEmail(email.value)
        if (emailError.value) Message.error("请输入正确的邮箱")
        captchaError.value = !validateNotEmpty(captcha.value, '请输入验证码')
        if (captchaError.value) return

        postLoginByEmail(email.value, captcha.value).then(res => {
            if (res.status_code !== constStore.CodeSuccess.code) {
                Message.error(res.status_msg)
            } else {
                token = res.token
                authStore.token = res.token
                localStorage.setItem('token', res.token)
                router.push('/')
            }
        })
    } else {
        Message.error('页面发生错误')
    }
}

function sendCaptcha() {
    if (btnSendCaptchaText.value !== '发送验证码') {
        return
    }
    if (validateEmail(email.value) === false) {
        Message.error("请输入邮箱")
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
    }, 1000);
    postSendCaptcha(email.value).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.status_msg)
        } else {
            Message.success("已发送邮箱验证码")
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
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
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
#login-form .arco-tabs-tab {
    margin: 0 40px;
}

#login-form .arco-tabs-nav-tab {
    justify-content: center;
}
</style>
