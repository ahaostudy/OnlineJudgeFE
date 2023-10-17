<template>
    <div>
        <Navbar></Navbar>
        <div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const username = ref(route.params.username)
</script>

<style scoped lang="less"></style>