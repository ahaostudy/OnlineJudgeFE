<template>
    <div class="navbar">
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
                <a-menu-item key="2">题库</a-menu-item>
                <a-menu-item key="3">竞赛</a-menu-item>
                <a-menu-item key="4">校队</a-menu-item>
            </a-menu>

        </div>
        <ul class="right-side">
            <li class="btn" @click="router.push('/login')">
                <div>登录</div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
    default: {
        type: String,
        default: '1',
    }
})

</script>

<style lang="less" scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
}

.left-side {
    display: flex;
    padding-left: 20px;

    .logo {
        width: 24px;
        margin: 0 15px;
    }
}

.center-side {
    flex: 1;
}

.right-side {
    padding: 0 30px;
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
.message-popover .arco-popover-content {
    margin-top: 0;
}
</style>
