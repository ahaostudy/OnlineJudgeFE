<template>
    <div id="note-list-container">
        <div class="note-card" v-for="note in notes" :key="note.id">
            <div class="note-card-top">
                <a-avatar :style="{ width: '24px', height: '24px' }" :imageUrl="appStore.user.avatar">
                </a-avatar>
                <div class="note-card-top-name">
                    {{ appStore.user.nickname }}
                </div>
            </div>
            <div class="note-card-body">
                <div class="note-card-body-title" @click="$router.push(`/note/${note.id}`)">
                    {{ note.title }}
                </div>
                <div class="note-card-body-content">
                    {{ note.content.replace('[//]: # (笔记填到此处嗷~)', '').replace('[//]: # (笔记_END)', '') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { getNotes } from '../../../services/note';
import { useConstStore } from '../../../store/const';
import { useAppStore } from '../../../store/app';
import { Message } from '@arco-design/web-vue';

const constStore = useConstStore()
const appStore = useAppStore()

const notes = reactive([])

onMounted(() => {
    getNotes().then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.status_msg)
            return
        }

        for (let note of res.note_list) {
            notes.push(note)
        }
    })
})
</script>

<style scoped lang="less">
#note-list-container {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.note-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-bottom: 1px solid var(--color-neutral-2);

    .note-card-top {
        display: flex;
        align-items: center;
        gap: 10px;

        .note-card-top-name {
            color: var(--color-neutral-8);
        }
    }

    .note-card-body {
        display: flex;
        flex-direction: column;
        margin-left: 24px;
        padding: 10px;
        gap: 6px;

        .note-card-body-title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 12px;
        }
        .note-card-body-title:hover {
            cursor: pointer;
            color: rgb(var(--primary-6));
        }

        .note-card-body-content {
            color: var(--color-neutral-8);
            padding-bottom: 10px;
        }
    }
}
</style>