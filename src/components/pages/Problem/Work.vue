<template>
    <div id="work-container">
        <a-tabs v-model:active-key="activeKey">
            <a-tab-pane key="1">
                <template #title>
                    <icon-code /> 代码
                </template>
                <Buttons @debug="debug" @submit="submit" v-model:language="language" @update:language="chagneLanguage">
                </Buttons>
                <Editor :language="constStore.LanguageSuffixs[language]" @change="changeCode" v-model="code">
                </Editor>
            </a-tab-pane>
            <a-tab-pane key="2">
                <template #title>
                    <icon-file /> 测试样例
                </template>
                <Buttons @debug="debug" @submit="submit" v-model:language="language" @update:language="chagneLanguage">
                </Buttons>
                <Console v-model:problem="props.problem" v-model:sample="sample" :status="status" :stdout="stdout">
                </Console>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Editor from './Editor.vue';
import Console from './Console.vue';
import Buttons from './Buttons.vue';
import { ref } from 'vue';
import { postDebug } from '../../../services/submit'
import { useConstStore } from '../../../store/const';
import { Message } from '@arco-design/web-vue';

const props = defineProps({
    id: { require: true },
    problem: { require: true },
});
const constStore = useConstStore()

const activeKey = ref('1')
const language = ref(Number(localStorage.getItem(`language`)) || 1)
const sample = ref(0)
const status = ref(constStore.StatusHide)
const stdout = ref('')
const code = ref(localStorage.getItem(`code-${props.id}-${language.value}`) || '')

// 实时保存代码
function changeCode(val) {
    localStorage.setItem(`code-${props.id}-${language.value}`, val)
}

// 切换语言
function chagneLanguage(value) {
    code.value = localStorage.getItem(`code-${props.id}-${value}`) || ''
    localStorage.setItem(`language`, value)
}

// 调试代码
function debug() {
    activeKey.value = '2'
    status.value = constStore.StatusRunning

    postDebug(code.value, props.problem.samples[sample.value].input, language.value).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.Message)
            return
        }
        props.problem.samples[sample.value].output = res.result.output
        status.value = res.result.status
        // 代码错误
        if (status.value !== constStore.StatusAccepted && status.value !== constStore.StatusAccepted) {
            stdout.value = res.result.error
        } else {
            stdout.value = `执行时间：${res.result.time} ms  执行内存：${res.result.memory/1024/1024} MB`
        }
    })
}

// 提交代码
function submit() {
    console.log('submit')
}
</script>

<style scoped lang="less">
#work-container {
    height: 100%;
}

.editor-btns {
    height: 32px;
    padding: 10px 20px;

    border-bottom: 1px solid var(--color-neutral-1);

    display: flex;
    justify-content: space-between;
}
</style>

<style>
#work-container .arco-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
}

#work-container .arco-tabs-content,
#work-container .arco-tabs-content-list,
#work-container .arco-tabs-content-item,
#work-container .arco-tabs-pane {
    padding: 0;
    height: 100%;
}
</style>