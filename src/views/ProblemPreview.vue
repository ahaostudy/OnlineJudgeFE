<template>
    <div id="problem-preview">
        <div class="title">
            <img alt="logo" src="../assets/logo.svg" style="height: 28px" class="btn-index" />
            {{ id }}. {{ problem.title }}
        </div>
        <div class="limit">
            时间限制：{{ problem.max_time }} s
            &nbsp;
            空间限制：{{ problem.max_memory / 1024 / 1024 }} MB
        </div>
        <v-md-preview :text="`\n\n${problem.description}\n` +
            `#### 输入描述\n${problem.input_desc}\n` +
            `#### 输出描述\n${problem.output_desc}\n` +
            `#### 数据范围\n${problem.data_range}\n` +
            `${samplesText}\n` +
            `${problem.tips ? '#### 提示\n' + problem.tips : ''}\n`"></v-md-preview>
    </div>
</template>

<script setup>

import { getProblem } from '../services/problem'
import { useConstStore } from '../store/const';
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();

const id = ref(route.params.id)

const constStore = useConstStore()
const problem = reactive({
    title: '',
    description: '',
    input_desc: '',
    output_desc: '',
    data_range: '',
    max_time: '',
    max_memory: '',
    tips: '',
    difficulty: '',
    samples: [],
    status: [],
    stdouts: [],
})
const samplesText = ref('')

onMounted(() => {
    getProblem(id.value).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            return
        }

        for (let key in res.problem) {
            problem[key] = res.problem[key];
        }

        for (const i in res.samples) {
            const sample = res.samples[i]
            samplesText.value += `#### 示例 ${Number(i) + 1}\n` +
                `**输入**\n` +
                `\`\`\`\n${sample.input}\n\`\`\`\n` +
                `**输出**\n` +
                `\`\`\`\n${sample.output}\n\`\`\`\n`
        }
        res.problem['samples'] = res.samples
    })
})
</script>

<style scoped lang="less">
#problem-preview {
    padding: 20px 8px;
    max-width: 1500px;
    margin: auto;

    .title {
        padding: 32px;

        display: flex;
        align-items: center;
        gap: 20px;

        font-size: 22px;
        background-color: var(--color-bg-1);

        cursor: default;
    }

    .limit {
        margin: 10px 0;
        padding-left: 32px;
        font-size: 13px;
        color: var(--color-text-2);
    }
}
</style>

<style>
#problem-preview .github-markdown-body h4 {
    margin: 40px 0 16px;
}

#problem-preview .github-markdown-body {
    font-size: 14px;
}
</style>
