<template>
    <div id="table-container">
        <div class="table">
            <a-table :columns="columns" :data="problems" :pagination="false" :loading="loading"
                @row-click="pushProblemDetail" />
        </div>
        <div class="pagination">
            <a-pagination :total="total" :current="current" :page-size="pageSize" @change="change"></a-pagination>
        </div>
    </div>
</template>
  
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getProblems, getProblemCount } from "../../../services/problem";
import { useProblemStore } from "../../../store/problem.js";
import { useConstStore } from "../../../store/const.js";
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const problemStore = useProblemStore();
const constStore = useConstStore();

const columns = [
    { title: '状态', dataIndex: 'status' },
    { title: '序号', dataIndex: 'id' },
    { title: '题目', dataIndex: 'title' },
    { title: '通过率', dataIndex: '' },
    { title: '难度', dataIndex: 'difficulty' },
];

const problems = reactive([]);
const current = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)

const change = function (number) {
    updateProblems(number)
}

function updateProblems(page) {
    loading.value = true
    getProblems(page, pageSize.value).then(res => {
        problems.splice(0)
        for (let p of res.problem_list) {
            p['key'] = p['id'];
            p['difficulty'] = problemStore.difficulty[p['difficulty']];
            problems.push(p);
        }
        loading.value = false
        current.value = page
    })
}

function pushProblemDetail(record) {
    console.log("push problem detail:", record.id)
    router.push('/problem/' + record.id)
}

onMounted(() => {
    getProblemCount().then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.status_msg)
            return
        }
        total.value = res.count
    })
    updateProblems(current.value)
})

</script>

<style scoped lang="less">
#table-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .pagination {
        display: flex;
        justify-content: end;
    }
}
</style>