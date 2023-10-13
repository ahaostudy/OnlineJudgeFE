<template>
    <a-split :style="{ height: '100%' }" :default-size="0.7" id="submits-container">
        <template #first>
            <a-skeleton :style="{ padding: '40px' }" :animation="true" v-show="loading">
                <a-space direction="vertical" :style="{ width: '100%' }" size="large">
                    <a-skeleton-line :rows="6" :line-height="28" :line-spacing="22"
                        :widths="['20%', '60%', '30%', '90%', '90%', '90%']" />
                </a-space>
            </a-skeleton>
            <a-empty :style="{ marginTop: '120px' }" v-show="empty" />
            <div v-show="!loading && !empty && !editing">
                <div class="preview-btns">
                    {{ submit.createdTime }}
                    <a-button type="text" @click="editing = true">
                        <template #icon>
                            <icon-edit />
                        </template>
                        编辑
                    </a-button>
                </div>
                <v-md-preview :text="submitInfo" />
            </div>
            <div class="editor-box" v-show="!loading && !empty && editing">
                <div class="editor-top">
                    <a-input :style="{ width: '320px' }" placeholder="请输入笔记标题" allow-clear />
                    <div class="editor-btns">
                        <a-button @click="editing = false">
                            取消编辑
                        </a-button>
                        <a-button type="primary">
                            <template #icon>
                                <icon-save />
                            </template>
                            保存为笔记
                        </a-button>
                    </div>
                </div>
                <div class="editor">
                    <v-md-editor class="editor" v-model="note" v-show="!loading && !empty" />
                </div>
            </div>
        </template>
        <template #second>
            <div class="table-top">
                <div>提交记录</div>
                <a-button type="text" @click="flushTable">
                    <template #icon>
                        <icon-sync />
                    </template>
                    刷新
                </a-button>
            </div>
            <div id="submit-record">
                <a-table :columns="columns" :data="submits" :bordered="{ wrapper: true, cell: true }" :stripe="true"
                    :pagination="{ defaultPageSize: 20, showPageSize: true, showTotal: true }" size="mini"
                    :style="{ minWidth: '430px' }">
                    <template #status="{ record }">
                        <a-tag :color="record.status.color" :style="{ width: '100%', height: '100%' }"
                            @click="selectSubmit(record)" class="status">
                            {{ record.status.status }}
                        </a-tag>
                    </template>
                </a-table>
            </div>
        </template>
    </a-split>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getSubmit, getSubmits } from '../../../services/submit'
import { useConstStore } from '../../../store/const';
import { Message } from '@arco-design/web-vue';

const props = defineProps({
    id: { require: true }
})
const constStore = useConstStore()

const languages = reactive([])
for (const i in constStore.Languages) {
    languages.push({
        value: Number(i) + 1,
        text: constStore.Languages[i]
    })
}

const statuses = reactive([])
for (const key in constStore.Status) {
    if (key == constStore.StatusHide || key == constStore.StatusFinished || key == constStore.StatusServerFailed) continue
    statuses.push({
        value: key,
        text: constStore.GetStatus(key).status
    })
}

const columns = reactive([
    {
        title: '提交时间',
        dataIndex: 'submit_time',
        sortable: {
            sortDirections: ['descend', 'ascend']
        }
    },
    {
        title: '状态',
        slotName: 'status',
        filterable: {
            filters: statuses,
            filter: (value, record) => record.status.code == value
        }
    },
    {
        title: '语言',
        dataIndex: 'language',
        filterable: {
            filters: languages,
            filter: (value, record) => record.lang_id == value
        }
    },
    { title: '时间', dataIndex: 'time' },
    { title: '内存', dataIndex: 'memory' }
])

const submits = reactive([])
const submit = reactive({
    statusText: '',
    time: '',
    memory: '',
    language: '',
    langSuf: '',
    code: '',
    createdTime: ''
})
const submitInfo = ref('')
const note = ref('')
const loading = ref(true)
const empty = ref(true)
const editing = ref(false)

function flushTable() {
    submits.splice(0)

    getSubmits(props.id).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            loading.value = false
            Message.error(res.status_msg)
            return
        }
        if (!res.submit_list || !res.submit_list.length) {
            loading.value = false
            empty.value = true
            return
        }
        empty.value = false

        const errors = [constStore.StatusCompileError, constStore.StatusRuntimeError, constStore.StatusWrongAnswer]
        const warnings = [constStore.StatusTimeLimitExceeded, constStore.StatusMemoryLimitExceeded, constStore.StatusOutputLimitExceeded]
        for (let s of res.submit_list) {
            s['key'] = s['id']
            s['submit_time'] = new Date(s['created_at']).toLocaleString()
            s['language'] = constStore.Languages[s['lang_id'] - 1]

            s['status'] = constStore.GetStatus(s['status'])

            if (errors.indexOf(s['status'].code) !== -1) s['status'].color = 'red'
            else if (warnings.indexOf(s['status'].code) !== -1) s['status'].color = 'orange'
            else s['status'].color = 'green'

            if (s['status'].code === constStore.StatusAccepted) {
                s['time'] = s['time'] + 'ms'
                s['memory'] = (s['memory'] / 1024 / 1024).toFixed(1) + 'MB'
            } else {
                s['time'] = '-'
                s['memory'] = '-'
            }

            submits.push(s)
        }

        selectSubmit(submits[0])
    })
}

function selectSubmit(record) {
    loading.value = true
    editing.value = false

    getSubmit(record.id).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            return
        }
        for (const key in res.submit) {
            submit[key] = res.submit[key]
        }
        submit.statusText = constStore.GetStatus(submit.status).status
        submit.language = record.language
        submit.langSuf = constStore.LanguageSuffixs[submit.lang_id - 1]
        submit.memory = (submit.memory / 1024 / 1024).toFixed(1)
        submit.createdTime = new Date(submit.created_at).toLocaleString()

        submitInfo.value = `### ${constStore.GetStatus(submit.status).status}\n\n` +
            `执行用时：${submit.time} ms &nbsp;&nbsp;&nbsp; 执行内存：${(submit.memory / 1024 / 1024).toFixed(1)} MB\n\n` +
            `### ${record.language}\n\n` +
            "``` " + constStore.LanguageSuffixs[submit.lang_id - 1] + "\n" +
            `${submit.code}\n` +
            "```\n"
        note.value = `[//]: # (笔记填到此处嗷~)\n\n\n\n[//]: # (笔记_END)\n\n\n***\n\n\n${submitInfo.value}`
        loading.value = false
    })
}

function edit() {
    editing.value = true
}

onMounted(() => {
    flushTable()
})
</script>

<style scoped>
.preview-btns {
    padding: 10px 0;
    margin: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-3);
}

.editor-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .editor-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid var(--color-neutral-3);

        .editor-btns {
            display: flex;
            justify-content: end;
            gap: 10px;
        }
    }

    .editor {
        flex: 1;
        padding: 16px;
    }
}

.table-top {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

#submit-record {
    .status {
        cursor: pointer;
    }
}
</style>

<style>
#submits-container .v-md-editor {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.07);
}

#submit-record .arco-table-th {
    background-color: var(--color-bg-1);
}

#submit-record th {
    border-bottom: var(--color-neutral-3) 1px solid;
    color: var(--color-text-3);
}

#submit-record .arco-table-cell {
    padding: 6px;
}

#submit-record .v-md-editor__toolbar {
    display: none;
}
</style>
