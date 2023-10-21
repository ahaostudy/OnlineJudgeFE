<template>
    <div id="calendar-container" :style="{ gap: calendarSize.gap + 'px' }" ref="calendar">
        <div v-for="(week, i) in weeks" :key="i" class="calendar-week" :style="{ gap: calendarSize.gap + 'px' }">
            <a-tooltip v-for="(day, j) in week" :key="j" :content="`${day.date}，${props.data[day.key] || 0} 次提交`">
                <div class="calendar-day" :style="{
                    width: calendarSize.size + 'px',
                    height: calendarSize.size + 'px',
                    borderRadius: calendarSize.radius + 'px',
                    ...colorFromLevel[(props.data[day.key] || 0) >= 8 ? 4 : Math.ceil((props.data[day.key] || 0) / 2)]
                }">
                </div>
            </a-tooltip>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';

const props = defineProps({
    data: {
        default: {}
    },
    week: {
        type: Number,
        default: 53,
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

const calendar = ref(null);
const colorFromLevel = {
    0: { backgroundColor: '#ebedf0', outlineColor: '#dfe1e4' },
    1: { backgroundColor: '#9be9a8', outlineColor: '#94dda0' },
    2: { backgroundColor: '#40c463', outlineColor: '#3eba5f' },
    3: { backgroundColor: '#30a14e', outlineColor: '#2f9a4b' },
    4: { backgroundColor: '#216e39', outlineColor: '#216a38' },
}
const now = new Date();
const start = new Date();
start.setDate(now.getDate() - (props.week - 1) * 7 - now.getDay());

const weeks = reactive([]);
for (let i = 0; i < props.week; i++) {
    weeks.push([]);
    for (let j = 0; j < 7; j++) {
        const day = new Date(start);
        day.setDate(day.getDate() + i * 7 + j);
        weeks[i].push({
            date: `${day.getFullYear()}年${String(day.getMonth() + 1).padStart(2, '0')}月${String(day.getDate()).padStart(2, '0')}日`,
            key: `${day.getFullYear()}${String(day.getMonth() + 1).padStart(2, '0')}${String(day.getDate()).padStart(2, '0')}`,
        });
        // props.data[weeks[i][j].key] = 1 + Math.floor(Math.random() * 7.1);
    }
}

function updateSize() {
    const multiple = 2.4;
    const width = calendar._rawValue.offsetWidth;
    calendarSize.gap = width / ((multiple + 1) * props.week - 1);
    calendarSize.size = multiple * calendarSize.gap;
    calendarSize.radius = calendarSize.size / 5;
}

onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize);
})

onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
})
</script>

<style scoped lang="less">
#calendar-container {
    display: flex;

    .calendar-week {
        display: flex;
        flex-direction: column;

        .calendar-day {
            background-color: #ebedf0;
            outline: 1px solid #dfe1e4;
        }
    }


}
</style>