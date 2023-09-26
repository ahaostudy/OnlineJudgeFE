<template>
    <div id="problem-container">
        <div id="top-container">
            <a-typography-title :heading="4">
                {{ id }}. {{ problem.title }}
            </a-typography-title>
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
import { useRoute } from 'vue-router'

const route = useRoute();

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
    gap: 10px;
    background-color: var(--color-neutral-1);

    #top-container {
        padding-left: 40px;
        background-color: var(--color-bg-1);
    }

    #main-container {
        flex: 1;
        background-color: var(--color-bg-1);
    }
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