<template>
  <div id="problems-container">
    <div>
      <Navbar :default="'2'"></Navbar>
    </div>
    <a-row id="problems-content">
      <a-col
        :span="18"
        :style="{ minWidth: '800px', maxWidth: '1300px' }"
        class="center-box"
      >
        <div class="table-box">
          <a-divider />
          <!-- 搜索框 -->
          <div class="search-box">
            <a-select
              :default-value="difficulty"
              placeholder="难度"
              :scrollbar="scrollbar"
              :style="{ width: '150px' }"
              :allow-clear="true"
            >
              <a-option :value="0">简单</a-option>
              <a-option :value="1">中等</a-option>
              <a-option :value="2">困难</a-option>
            </a-select>
            <a-select
              placeholder="标签"
              multiple
              :scrollbar="scrollbar"
              :style="{ width: `${150 + 50 * labels.length}px` }"
              @change="change"
              :allow-clear="true"
            >
              <a-option>二分</a-option>
              <a-option>排序</a-option>
              <a-option>图论</a-option>
              <a-option>动态规划</a-option>
              <a-option>数论</a-option>
            </a-select>
            <a-input-search
              placeholder="题目序号、名称"
              :style="{ maxWidth: '320px' }"
              :allow-clear="true"
            />
          </div>
          <!-- 题目列表 -->
          <Table></Table>
        </div>
        <div class="cards">
          <a-card title="最近提交" class="card">
            <template #extra>
              <a-link>更多</a-link>
            </template>
            <a-table
              :columns="latest_submits_columns"
              :data="latest_submits"
              :pagination="false"
              :bordered="false"
            >
              <template #submit_time="{ record }">
                <a-typography-text :style="{ fontSize: '12px' }">
                  {{ record.submit_time }}
                </a-typography-text>
              </template>
              <template #status="{ record }">
                <icon-check-circle
                  :strokeWidth="5"
                  size="18px"
                  v-if="record.status"
                  :style="{ color: '#00b42a' }"
                />
                <icon-close-circle
                  :strokeWidth="5"
                  size="18px"
                  v-else
                  :style="{ color: '#f53f3f' }"
                />
              </template>
            </a-table>
          </a-card>
          <a-card title="推荐题单" class="card">
            <template #extra>
              <a-link>更多</a-link>
            </template>
            <a-table :pagination="false" :bordered="false" />
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import Table from '@/components/pages/Problems/Table.vue'
import { getLatestSubmits } from '@/services/submit'
import { useConstStore } from '@/store/const'

const constStore = useConstStore()

const labels = reactive([])
const difficulty = ref()

const latest_submits_columns = reactive([
  { title: '题目', dataIndex: 'problem_id' },
  { title: '提交时间', slotName: 'submit_time' },
  { title: '状态', slotName: 'status' }
])
const latest_submits = reactive([])

function change(value) {
  labels.splice(0, labels.length)
  labels.push(...value)
}

onMounted(() => {
  getLatestSubmits(8).then((res) => {
    if (res.status_code !== constStore.CodeSuccess.code) {
      Message.error(res.status_msg)
      return
    }

    console.log(res)
    for (let s of res.submit_list) {
      s['key'] = s['id']
      s['submit_time'] = new Date(s['created_at']).toLocaleString()
      s['status'] = s['status'] === constStore.StatusAccepted
      latest_submits.push(s)
    }
    console.log(latest_submits)
  })
})
</script>

<style scoped lang="less">
#problems-container {
  height: 100%;
}

#problems-content {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

.center-box {
  display: flex;
  gap: 20px;
  padding-bottom: 20px;

  .table-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 20px;

    background-color: var(--color-bg-1);

    .search-box {
      display: flex;
      gap: 20px;
      margin-bottom: 10px;
    }
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 20px;

    padding: 20px 0;

    .card {
      width: 280px;
    }
  }
}
</style>

<style>
#problems-container .arco-card-body {
  padding: 0;
}

#problems-container .arco-table-th {
  background-color: var(--color-bg-1);
}

#problems-container th {
  border-bottom: var(--color-neutral-3) 1px solid;
  color: var(--color-text-3);
}
</style>
