<template>
  <div id="table-container">
    <div class="table">
      <a-table
        :columns="columns"
        :data="problems"
        :pagination="false"
        :bordered="false"
        :stripe="true"
        :hoverable="false"
      >
        <template #is_accepted="{ record }">
          <icon-check-circle
            :strokeWidth="5"
            size="18px"
            v-show="record.is_accepted"
            :style="{ color: '#00b42a' }"
          />
        </template>
        <template #title="{ record }">
          <a-typography-text class="title">
            <router-link :to="'/problem/' + record.id">
              {{ record.title }}
            </router-link>
          </a-typography-text>
        </template>
        <template #submit_status="{ record }">
          <a-progress
            size="mini"
            v-if="record.submit_count"
            :percent="record.accepted_count / record.submit_count"
          />
          <a-progress
            size="mini"
            v-else
            :percent="
              record.submit_count
                ? record.accepted_count / record.submit_count
                : 0
            "
            status="danger"
          />
          {{ record.submit_status }}
        </template>
      </a-table>
    </div>
    <div class="pagination">
      <a-pagination
        :total="total"
        :current="current"
        :page-size="pageSize"
        @change="change"
        :show-page-size="true"
        :show-total="true"
        @page-size-change="pageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getProblems, getProblemCount } from '@/services/problem'
import { useProblemStore } from '@/store/problem.js'
import { useConstStore } from '@/store/const.js'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const problemStore = useProblemStore()
const constStore = useConstStore()

const columns = [
  { title: '状态', slotName: 'is_accepted' },
  { title: '序号', dataIndex: 'id' },
  { title: '题目', slotName: 'title' },
  { title: '提交', slotName: 'submit_status' },
  { title: '难度', dataIndex: 'difficultyText' }
]

const problems = reactive([])
const current = ref(1)
const pageSize = ref(50)
const total = ref(0)

const change = function (number) {
  updateProblems(number)
}

const pageSizeChange = function (size) {
  pageSize.value = size
  updateProblems(1)
}

function updateProblems(page) {
  getProblems(page, pageSize.value).then((res) => {
    problems.splice(0)
    for (let p of res.problem_list) {
      p['key'] = p['id']
      p['difficultyText'] = problemStore.difficulty[p['difficulty']]
      p['submit_status'] = `${p['accepted_count']} / ${p['submit_count']}`
      problems.push(p)
    }
    current.value = page
  })
}

onMounted(() => {
  getProblemCount().then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }
    total.value = res.count
  })
  updateProblems(current.value)
})
</script>

<style scoped lang="less">
#table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .table {
    .title {
      cursor: pointer;
    }

    .title:hover {
      color: rgb(var(--primary-6));
    }
  }

  .pagination {
    display: flex;
    justify-content: end;
  }
}
</style>

<style>
#table-container .arco-table-th {
  background-color: var(--color-bg-1);
}

#table-container
  .arco-table-stripe:not(.arco-table-dragging)
  .arco-table-tr:not(.arco-table-tr-empty):not(
    .arco-table-tr-summary
  ):nth-child(even)
  .arco-table-td:not(.arco-table-col-fixed-left):not(
    .arco-table-col-fixed-right
  ),
#table-container
  .arco-table-stripe
  .arco-table-tr-drag
  .arco-table-td:not(.arco-table-col-fixed-left):not(
    .arco-table-col-fixed-right
  ) {
  background-color: var(--color-neutral-1);
}

#table-container tr,
#table-container td {
  border: none;
}

#table-container th {
  border-bottom: var(--color-neutral-3) 1px solid;
  color: var(--color-text-3);
}
</style>
