<template>
    <div>
        <Navbar default="5"></Navbar>
        <Container>
            <div id="note-container">
                <div class="note-info-box">
                    <div class="note-title">{{ note.title }}</div>
                    <div class="note-publish-info">
                        <a-avatar :image-url="author.avatar" :size="20" v-if="author.avatar && author.avatar !== ''">
                        </a-avatar>
                        <a-avatar :size="20" :style="{ backgroundColor: '#165dff' }" v-else>
                            {{ author.nickname.substring(0, 1).toUpperCase() }}
                        </a-avatar>
                        <div>{{ author.nickname }}</div>
                        <div>发布于：{{ new Date(note.created_at).toLocaleString() }}</div>
                    </div>
                </div>
                <v-md-preview :text="note.content"></v-md-preview>
            </div>
        </Container>
    </div>
</template>


<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute } from 'vue-router'
import { getNote } from '../services/note'
import { useConstStore } from '../store/const';
import { Message } from '@arco-design/web-vue';
import Container from '../components/common/Container.vue';

const route = useRoute()
const constStore = useConstStore()

const id = ref(route.params.id)
const note = reactive({})
const author = reactive({
    nickname: '',
    avatar: '',
})

onMounted(() => {
    getNote(id.value).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.status_msg)
            return
        }

        for (const key in res.note) {
            note[key] = res.note[key]
        }
        for (const key in res.user) {
            author[key] = res.user[key]
        }
        if (author.avatar && author.avatar !== '')
            author.avatar = import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_STATIC_HOST + author.avatar
        else author.avatar = ''
    })

})
</script>

<style scoped>
#note-container {
    display: flex;
    flex-direction: column;
    margin: auto;

    .note-info-box {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 32px;

        .note-publish-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .note-title {
            padding: 20px 0 12px;
            font-size: 34px;
            font-weight: 600;
        }
    }
}
</style>

<style>
#note-container .github-markdown-body hr {
    height: 1px;
}
</style>