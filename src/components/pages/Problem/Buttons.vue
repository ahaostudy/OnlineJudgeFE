<template>
    <div id="editor-btns">
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
            <!-- <a-tooltip content="VIM模式" position="bottom">
                <a-button type="text" :style="{fontSize: '18px'}">
                    vim
                </a-button>
            </a-tooltip> -->
            <a-tooltip content="运行代码" position="bottom">
                <a-button type="text" @click="debug">
                    <icon-play-arrow size="20px" />
                </a-button>
            </a-tooltip>
            <a-tooltip content="调试代码（开发中）" position="bottom">
                <a-button type="text">
                    <icon-bug size="20px" />
                </a-button>
            </a-tooltip>
            <a-tooltip content="提交" position="bottom">
                <a-button type="text" @click="submit">
                    <icon-check size="20px" />
                </a-button>
            </a-tooltip>
            <a-tooltip content="分享题目" position="bottom">
                <a-button type="text" @click="$router.push(`/problem/preview/${props.id}`)">
                    <icon-share-alt size="20px" />
                </a-button>
            </a-tooltip>
            <a-tooltip content="设置（开发中）" position="bottom">
                <a-button type="text">
                    <icon-settings size="20px" />
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
const props = defineProps(['language', 'id'])

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

<style scoped lang="less">
#editor-btns {
    height: 28px;
    padding: 6px;

    border-bottom: 1px solid var(--color-neutral-1);

    display: flex;
    justify-content: space-between;

    .editor-right-btns {
        display: flex;
        align-items: center;
    }
}
</style>

<style>
#editor-btns .arco-btn-size-medium {
    margin-left: 7px;
    padding: 0 9px;
}
</style>