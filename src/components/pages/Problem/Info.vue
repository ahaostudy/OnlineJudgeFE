<template>
    <div id="problem-detail">
        <v-md-preview :text="`# ${problem.title}\n` +
            `#### 题目描述\n${problem.description}\n` +
            `#### 输入描述\n${problem.input_desc}\n` +
            `#### 输出描述\n${problem.output_desc}\n` +
            `${sample}` +
            `${tips}`"></v-md-preview>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getProblem } from '../../../services/problem'
import { useConstStore } from '../../../store/const';
import { Message } from '@arco-design/web-vue';

const props = defineProps({
    id: { required: true }
})
const constStore = useConstStore();

const sample = ref('')
const tips = ref('')
const problem = reactive({ })

onMounted(() => {
    getProblem(props.id).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.status_msg);
            return
        }

        for (let key in res.problem) {
            problem[key] = res.problem[key];
        }

        if (problem.tips.length > 0) {
            tips.value = `#### 提示\n${problem.tips}`
        }
    })
})
</script>

<style>
#problem-detail .github-markdown-body h4 {
    margin: 42px 0 16px;
}
</style>