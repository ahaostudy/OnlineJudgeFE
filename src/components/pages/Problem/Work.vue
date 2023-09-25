<template>
    <div style="height: 100%;">
        <a-split direction="vertical" :style="{ height: '100%' }" :default-size="0.75">
            <template #first>
                <Editor :language="cpp"></Editor>
            </template>
            <template #second>
                <div id="right-bottom-container">
                    <Console></Console>
                </div>
            </template>
        </a-split>
    </div>
</template>

<script setup>
import Editor from './Editor.vue';
import Console from './Console.vue';
</script>

<style scoped lang="less"></style>