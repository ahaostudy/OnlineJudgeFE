<template>
    <a-row id="navbar">
        <a-col :span="18" :style="{ minWidth: '800px', maxWidth: '1300px' }" id="navbar-box">
            <div class="left-side">
                <a-space>
                    <img alt="logo" src="../../assets/logo.svg" class="logo" />
                    <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
                        Online Judge
                    </a-typography-title>
                </a-space>
            </div>
            <div class="center-side">
                <a-menu mode="horizontal" :default-selected-keys="[props.default]">
                    <a-menu-item key="1">首页</a-menu-item>
                    <a-menu-item key="2" @click="router.push('/problems')">题库</a-menu-item>
                    <a-menu-item key="3">竞赛</a-menu-item>
                    <a-menu-item key="4">校队</a-menu-item>
                    <a-menu-item key="5" @click="router.push('/notes')">笔记</a-menu-item>
                </a-menu>
            </div>
            <ul class="right-side">
                <li class="btn" @click="router.push('/login')" v-show="!logined">
                    <div>登录</div>
                </li>
                <li v-show="logined">
                    <a-dropdown position="br">
                        <a-avatar :image-url="appStore.user.avatar" :size="30"></a-avatar>
                        <template #content>
                            <a-doption>
                                <template #icon> <icon-file /> </template>
                                个人资料
                            </a-doption>
                            <a-doption>
                                <template #icon> <icon-settings /> </template>
                                个人设置
                            </a-doption>
                            <a-doption @click="logout">
                                <template #icon> <icon-export /> </template>
                                退出登录
                            </a-doption>
                        </template>
                    </a-dropdown>
                </li>
            </ul>
        </a-col>
    </a-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser } from '../../services/user'
import { useConstStore } from '../../store/const';
import { useAppStore } from "../../store/app";

const router = useRouter()
const constStore = useConstStore()
const appStore = useAppStore()
const staticPath = import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_STATIC_HOST

const logined = ref(false)

const props = defineProps({
    default: {
        type: String,
        default: '1',
    }
})

onMounted(() => {
    if (localStorage.getItem('token')) {
        logined.value = true
        getUser(-1).then(res => {
            if (res.status_code !== constStore.CodeSuccess.code) return
            for (let key in res.user) {
                appStore.user[key] = res.user[key]
            }
            appStore.user.avatar = staticPath + res.user.avatar
        })
    }
})

function logout() {
    localStorage.removeItem('token')
    router.push('/login')
}
</script>

<style lang="less" scoped>
#navbar {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-bg-2);
}

#navbar-box {
    display: flex;
    justify-content: space-between;
    height: 100%;
}

.left-side {
    display: flex;
    padding-left: 20px;

    .logo {
        width: 24px;
        margin-right: 15px;
    }
}

.center-side {
    flex: 1;
}

.right-side {
    padding-left: 40px;
    display: flex;
    gap: 15px;
    margin: 0;

    li {
        list-style: none;
        display: flex;
        align-self: center;
        color: var(--color-text-3)
    }

    .btn:hover {
        cursor: pointer;
        color: var(--color-text-1);
    }
}
</style>
  
<style >
#navbar .message-popover .arco-popover-content {
    margin-top: 0;
}
</style>
