<template>
  <div id="user-submit-stats-container">
    <div>
      <a-typography-title :heading="6"> 过去一年提交 </a-typography-title>
      <div class="submit-calendar-graph">
        <Calendar
          :data="calendarData"
          :show-outline="false"
          :show-date-label="false"
        />
      </div>
    </div>
    <div class="user-submit-count">
      <a-typography-title :heading="6"> 做题统计 </a-typography-title>
      <div class="user-submit-count-list">
        <div>1</div>
        <div>1</div>
        <div>1</div>
        <div>1</div>
      </div>
    </div>
    <div class="user-submit-latest-list">
      <a-typography-title :heading="6"> 近期提交 </a-typography-title>
      <a-list :bordered="false">
        <a-list-item v-for="submit in latestSubmits" :key="submit.id">
          <div class="user-submit-latest-list-item-left">
            <icon-check-circle
              :strokeWidth="5"
              size="18px"
              v-if="submit.status == 10"
              :style="{ color: '#00b42a' }"
            />
            <icon-close-circle
              :strokeWidth="5"
              size="18px"
              v-else
              :style="{ color: '#f53f3f' }"
            />
            <!-- TODO: 改为题目标题 -->
            {{ `${submit.problem_id}. ${submit.problem.title}` }}
          </div>
          <template #actions>
            {{ new Date(submit.created_at).toLocaleDateString() }}
          </template>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useConstStore } from '../../../store/const'
import { getLatestSubmits, getSubmitCalendar } from '../../../services/submit'
import Calendar from '../../common/Calendar.vue'
import { Message } from '@arco-design/web-vue'

const constStore = useConstStore()

const props = defineProps({
  user: {
    require: true,
    default: {
      id: 0
    }
  }
})

const calendarData = reactive({})
const latestSubmits = reactive([])
watch(
  () => props.user.id,
  (id) => {
    getSubmitCalendar(id).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }

      for (const key in res.data) {
        calendarData[key] = res.data[key]
      }
    })
    //TODO: 通过用户ID获取最近提交
    getLatestSubmits(6, id).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }

      for (const s of res.submit_list) {
        latestSubmits.push(s)
      }
      console.log(latestSubmits)
    })
  }
)
</script>

<style scoped lang="less">
#user-submit-stats-container {
  display: flex;
  flex-direction: column;
  gap: 50px;

  .user-submit-count {
  }

  .user-submit-latest-list {
    .user-submit-latest-list-item-left {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}
</style>

<style>
#user-submit-stats-container .arco-list-item {
  padding-left: 0;
  padding-right: 0;
}
</style>
