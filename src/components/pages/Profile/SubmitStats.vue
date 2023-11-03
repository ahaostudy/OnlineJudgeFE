<template>
  <div id="user-submit-stats-container">
    <div class="user-submit-statistics">
      <a-typography-title :heading="6"> 做题统计 </a-typography-title>
      <div class="user-submit-statistics-flex">
        <div class="user-submit-statistics-half">
          <a-list :bordered="false">
            <a-list-item>
              解决
              <template #actions>
                <div>
                  {{ submitStatistics.slove_count }}
                </div>
              </template>
            </a-list-item>
            <a-list-item>
              总尝试数
              <template #actions>
                {{ submitStatistics.submit_count }}
              </template>
            </a-list-item>
            <a-list-item>
              简单题
              <template #actions> {{ submitStatistics.easy_count }} </template>
            </a-list-item>
            <a-list-item>
              中等题
              <template #actions>
                {{ submitStatistics.middle_count }}
              </template>
            </a-list-item>
            <a-list-item>
              困难题
              <template #actions> {{ submitStatistics.hard_count }} </template>
            </a-list-item>
            <a-list-item style="padding: 0"></a-list-item>
          </a-list>
        </div>
        <div class="user-submit-statistics-half">
          <a-list :bordered="false">
            <a-list-item
              v-for="lang in submitStatistics.lang_counts"
              :key="lang.id"
            >
              {{ constStore.Languages[lang.id] }}
              <template #actions> {{ lang.count }} </template>
            </a-list-item>
            <a-list-item style="padding: 0"></a-list-item>
          </a-list>
        </div>
      </div>
    </div>
    <div>
      <a-typography-title :heading="6"> 过去一年提交 </a-typography-title>
      <div class="submit-calendar-graph">
        <Calendar
          :data="calendarData"
          :show-outline="false"
          :show-date-label="false"
          :auto-size="true"
        />
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
            <router-link :to="`/problem/${submit.problem_id}`">
              {{ `${submit.problem_id}. ${submit.problem.title}` }}
            </router-link>
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
import {
  getLatestSubmits,
  getSubmitCalendar,
  getSubmitStatistics
} from '../../../services/submit'
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
const submitStatistics = reactive({
  submit_count: 0,
  slove_count: 0,
  easy_count: 0,
  middle_count: 0,
  hard_count: 0,
  lang_counts: []
})
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
    getSubmitStatistics(id).then((res) => {
      if (res.status_code !== constStore.CodeSuccess.code) {
        Message.error(res.status_msg)
        return
      }
      submitStatistics.submit_count = res.submit_count
      submitStatistics.slove_count = res.slove_count
      submitStatistics.easy_count = res.easy_count
      submitStatistics.middle_count = res.middle_count
      submitStatistics.hard_count = res.hard_count
      submitStatistics.lang_counts = res.lang_counts
    })
  }
)
</script>

<style scoped lang="less">
#user-submit-stats-container {
  display: flex;
  flex-direction: column;
  gap: 50px;

  .user-submit-statistics-flex {
    display: flex;
    gap: 40px;

    .user-submit-statistics-half {
      flex: 1;
    }

    .user-submit-statistics-left-list {
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .user-submit-statistics-left-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
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
