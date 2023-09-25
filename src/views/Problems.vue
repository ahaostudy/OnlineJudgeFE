<template>
    <div>
        <div>
            <Navbar :default="'2'"></Navbar>
        </div>
        <a-row id="container">
            <a-col :span="14" :offset="3">
                <Table></Table>
            </a-col>

            <a-col :span="4">
                <h1>hello</h1>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import Navbar from "../components/common/Navbar.vue"
import Table from "../components/pages/Problems/Table.vue";
</script>

<style scoped lang="less">
#container {
    padding-top: 20px;
}

#left-container {
    flex: 1;
}
</style>