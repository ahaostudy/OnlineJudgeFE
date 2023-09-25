<template>
    <div id="container">
        <div id="top-container">
            t
        </div>
        <div id="main-container">
            <a-split direction="horizontal" id="big-container" :style="{ height: '100%' }" :default-size="0.2" :min="'350px'">
                <template #first>
                    <div id="left-container">
                        <Info :id="id"></Info>
                    </div>
                </template>
                <template #second>
                    <Work :id="id"></Work>
                </template>
            </a-split>
        </div>
    </div>
</template>

<script setup>
import Info from '../components/pages/Problem/Info.vue'
import Work from '../components/pages/Problem/Work.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();
const id = ref(route.params.id)
</script>

<style scoped lang="less">
#container {
    height: 100vh;
    display: flex;
    flex-direction: column;

    #top-container {
        height: 64px;
        background-color: #ccc;
        margin-bottom: 12px;
    }

    #main-container {
        flex: 1;
    }
}
</style>