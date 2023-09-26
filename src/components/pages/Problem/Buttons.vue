<template>
    <div class="editor-btns">
        <div class="editor-left-btns">
            <a-select
                :style="{ width: `${constStore.Languages[language - 1].length * 12 + 42}px`, minWidth: '80px', maxWidth: '120px' }"
                :bordered="false" v-model="props.language" @change="change">
                <a-option v-for="(lang, i) in constStore.Languages" :key="i + 1" :value="i + 1">
                    {{ lang }}
                </a-option>
            </a-select>
        </div>
        <div class="editor-right-btns">
            <a-tooltip content="运行代码" position="bottom">
                <a-button type="text" @click="debug">
                    <icon-play-arrow size="22px" />
                </a-button>
            </a-tooltip>
            <a-tooltip content="调试代码（开发中）" position="bottom">
                <a-button type="text">
                    <icon-bug size="22px" />
                </a-button>
            </a-tooltip>
            <a-tooltip content="提交" position="bottom">
                <a-button type="text" @click="submit">
                    <icon-send size="22px" rotate="-90" />
                </a-button>
            </a-tooltip>
        </div>
    </div>
</template>

<script setup>
import { useConstStore } from '../../../store/const';
import { defineEmits } from 'vue'

const constStore = useConstStore()
const emit = defineEmits(['update:language', 'debug', 'submit'])
const props = defineProps(['language'])

function change(value) {
    emit('update:language', value);
}

function debug() {
    emit('debug')
}

function submit() {
    emit('submit')
}
</script>
