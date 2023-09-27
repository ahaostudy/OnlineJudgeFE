<template>
    <div id="problem-container">
        <div id="top-container">
            <img alt="logo" src="../assets/logo.svg" style="height: 26px" class="btn-index" @click="router.push('/problems')"/>
            {{ id }}. {{ problem.title }}
        </div>
        <div id="main-container">
            <a-split direction="horizontal" :style="{ height: '100%' }" :default-size="0.2" :min="'400px'">
                <template #first>
                    <div id="left-container">
                        <Info :id="id" @get-problem="getProblem"></Info>
                    </div>
                </template>
                <template #second>
                    <Work :id="id" :problem="problem"></Work>
                </template>
            </a-split>
        </div>
    </div>
</template>

<script setup>
import Info from '../components/pages/Problem/Info.vue'
import Work from '../components/pages/Problem/Work.vue'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();

const id = ref(route.params.id)
const problem = reactive({
    title: '',
})

function getProblem(p) {
    for (let key in p) {
        problem[key] = p[key]
    }
}
</script>

<style scoped lang="less">
#problem-container {
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    background-color: var(--color-neutral-1);
}

#top-container {
    padding: 20px 40px;

    display: flex;
    align-items: center;
    gap: 20px;

    font-size: 20px;
    background-color: var(--color-bg-1);

    cursor: default;

    .btn-index {
        cursor: pointer;
    }
}

#main-container {
    height: 100%;
    overflow-y: auto;
    background-color: var(--color-bg-1);
}
</style>

<style>
#problem-container .arco-split-trigger-icon-wrapper {
    background-color: var(--color-neutral-1);
}

#problem-container .arco-split-trigger-vertical {
    width: 10px;
}

#problem-container .arco-split-trigger-horizontal {
    height: 10px;
}

#problem-container #top-container .arco-typography {
    margin: 0.8em 0;
}
</style>