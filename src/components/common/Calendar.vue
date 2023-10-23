<template>
  <div
    id="calendar-container"
    :style="{ gap: calendarSize.gap + 'px' }"
    ref="calendar"
  >
    <div
      class="calendar-week"
      v-if="props.showDateLabel"
      :style="{ gap: calendarSize.gap + 'px' }"
    >
      <div
        v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
        :key="day"
        :style="{
          height: calendarSize.size + 'px',
          borderRadius: calendarSize.radius + 'px'
        }"
      >
        {{ day }}
      </div>
      <div v-if="props.showMonthLabel">&nbsp;</div>
    </div>
    <div
      v-for="(week, i) in weeks"
      :key="i"
      class="calendar-week"
      :style="{ gap: calendarSize.gap + 'px' }"
    >
      <a-tooltip
        v-for="(day, j) in week"
        :key="j"
        :content="`${day.date}，${props.data[day.key] || 0} 次提交`"
      >
        <div
          :style="{
            width: calendarSize.size + 'px',
            height: calendarSize.size + 'px',
            borderRadius: calendarSize.radius + 'px',
            outline: props.showOutline ? '1px solid rgba(0, 0, 0, 0)' : 'none',
            ...colorFromLevel[
              (props.data[day.key] || 0) >= 8
                ? 4
                : Math.ceil((props.data[day.key] || 0) / 2)
            ]
          }"
        ></div>
      </a-tooltip>
      <div
        class="month-label"
        v-if="props.showMonthLabel"
        :style="{
          width: calendarSize.size + 'px',
          height: calendarSize.size + 'px'
        }"
      >
        <div v-if="week.some((d) => d.key.endsWith('07'))">
          {{ Math.floor((Number(week[6].key) % 10000) / 100) }}月
        </div>
        <div v-else-if="i == 0 && !week[0].key.endsWith('01')">
          {{ Math.floor((Number(week[0].key) % 10000) / 100) }}月
        </div>
        <div v-else>&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'

const props = defineProps({
  data: {
    default: {
      20230101: 0
    }
  },
  week: {
    type: Number,
    default: 53
  },
  size: {
    type: Number,
    default: 10
  },
  radius: {
    type: Number,
    default: 2
  },
  gap: {
    type: Number,
    default: 3
  },
  showOutline: {
    type: Boolean,
    default: true
  },
  showDateLabel: {
    type: Boolean,
    default: true
  },
  showMonthLabel: {
    type: Boolean,
    default: true
  },
  autoSize: {
    type: Boolean,
    default: true
  }
})

const calendarSize = reactive({
  size: props.size,
  gap: props.gap,
  radius: props.radius
})

const calendar = ref(null)
const colorFromLevel = {
  0: { backgroundColor: '#ebedf0', outlineColor: '#dfe1e4' },
  1: { backgroundColor: '#9be9a8', outlineColor: '#94dda0' },
  2: { backgroundColor: '#40c463', outlineColor: '#3eba5f' },
  3: { backgroundColor: '#30a14e', outlineColor: '#2f9a4b' },
  4: { backgroundColor: '#216e39', outlineColor: '#216a38' }
}
const now = new Date()
const start = new Date()
start.setDate(now.getDate() - (props.week - 1) * 7 - now.getDay())

const weeks = reactive([])
for (let i = 0; i < props.week; i++) {
  weeks.push([])
  for (let j = 0; j < 7; j++) {
    const day = new Date(start)
    day.setDate(day.getDate() + i * 7 + j)
    weeks[i].push({
      date: `${day.getFullYear()}年${String(day.getMonth() + 1).padStart(
        2,
        '0'
      )}月${String(day.getDate()).padStart(2, '0')}日`,
      key: `${day.getFullYear()}${String(day.getMonth() + 1).padStart(
        2,
        '0'
      )}${String(day.getDate()).padStart(2, '0')}`
    })
    // 随机生成，测试使用
    // props.data[weeks[i][j].key] = Math.floor(Math.random() * 8.1)
  }
}

function updateSize() {
  const multiple = props.showOutline ? 2.4 : 3
  const width = calendar._rawValue.offsetWidth - (props.showDateLabel ? 36 : 0)
  calendarSize.gap = width / ((multiple + 1) * props.week - 1)
  calendarSize.size = multiple * calendarSize.gap
  calendarSize.radius = calendarSize.size / 4
}

onMounted(() => {
  if (props.autoSize) {
    updateSize()
    window.addEventListener('resize', updateSize)
  }
})

onUnmounted(() => {
  if (props.autoSize) window.removeEventListener('resize', updateSize)
})
</script>

<style scoped lang="less">
#calendar-container {
  display: flex;

  .calendar-week {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    font-size: 12px;

    .month-label {
      overflow: visible;
      white-space: nowrap;
    }
  }
}
</style>
