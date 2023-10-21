<template>
    <div>
        <a-typography-title :heading="6">
            过去一年提交
        </a-typography-title>
        <div class="submit-calendar-graph">
            <Calendar :data="calendarData" />
        </div>
        <a-typography-title :heading="6">
            近期提交
        </a-typography-title>
        <div class="submit-record-table">
            <!-- <a-table :columns="columns">
            </a-table> -->
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useConstStore } from '../../../store/const';
import { getLatestSubmits, getSubmitCalendar } from '../../../services/submit'
import Calendar from '../../common/Calendar.vue'
import { Message } from '@arco-design/web-vue';

const constStore = useConstStore();

const props = defineProps({
    user: {
        require: true,
        default: {
            id: 0,
        }
    }
})

const calendarData = reactive({})
watch(() => props.user.id, (id) => {
    getSubmitCalendar(id).then(res => {
        if (res.status_code !== constStore.CodeSuccess.code) {
            Message.error(res.status_msg)
            return
        }

        for (const key in res.data) {
            calendarData[key] = res.data[key]
        }
        console.log(calendarData);
        console.log(calendarData['20230101']);
    })
})
</script>

<style scoped lang="less">
.submit-calendar-graph {
}
</style>