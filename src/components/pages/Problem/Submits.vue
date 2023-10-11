<template>
    <a-split :style="{ height: '100%' }" :default-size="0.65">
        <template #first>
            <a-skeleton :style="{ padding: '40px' }" :animation="true" v-show="loading">
                <a-space direction="vertical" :style="{ width: '100%' }" size="large">
                    <a-skeleton-line :rows="6" :line-height="28" :line-spacing="22"
                        :widths="['20%', '60%', '30%', '90%', '90%', '90%']" />
                </a-space>
            </a-skeleton>
            <a-empty :style="{ marginTop: '120px' }" v-show="empty"/>
            <v-md-preview :text="submitInfo" v-show="!loading && !empty" />
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
import { Empty, Message } from '@arco-design/web-vue';

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
const submitInfo = ref('')
const loading = ref(true)
const empty = ref(true)

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

    getSubmit(record.id).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            return
        }
        const submit = res.submit
        submitInfo.value = `## ${record.status.status}\n` +
            `执行用时：${submit.time} ms &nbsp;&nbsp;&nbsp; 执行内存：${(submit.memory / 1024 / 1024).toFixed(1)} MB\n` +
            `### ${record.language}\n` +
            "``` " + constStore.LanguageSuffixs[submit.lang_id - 1] + "\n" +
            `${submit.code}\n` +
            "```"
        loading.value = false
    })
}

onMounted(() => {
    flushTable()
})
</script>

<style scoped>
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
</style>
