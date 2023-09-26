<template>
    <div id="editor-container">
        <div ref="editor" class="editor"></div>
        <div ref="vim" class="vim"></div>
    </div>
</template>

<script setup>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
import { initVimMode } from 'monaco-vim';
import { getCurrentInstance, onMounted, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
    },
    language: {
        type: String,
        default: 'cpp',
    },
    fontSize: {
        type: String,
        default: '18px',
    }
})
const emit = defineEmits(['update:modelValue', 'change'])
const { proxy } = getCurrentInstance()

onMounted(() => {
    // 创建编辑器
    const editor = monaco.editor.create(proxy.$refs.editor, {
        value: props.modelValue,
        language: props.language,
        fontSize: props.fontSize,
        automaticLayout: true,
    })

    // 编辑器变化事件
    editor.onDidChangeModelContent(() => {
        const value = editor.getValue()
        emit('update:modelValue', value);
        emit('change', value)
    });

    // 初始化vim模式
    initVimMode(editor, proxy.$refs.vim)

    watch(
        () => props.modelValue,
        (newVal, _) => {
            if (newVal != editor.getValue()) {
                editor.setValue(newVal)
            }
        }
    )
})
</script>

<style scoped>
#editor-container {
    height: 90%;
    display: flex;
    flex-direction: column;

    .editor {
        flex: 1;
    }

    .vim {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 20px;
        background-color: var(--color-neutral-2);
    }
}
</style>
