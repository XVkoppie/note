<script setup>
import { useTimeStore } from '@/stores'
import { ref, computed, reactive, onMounted } from 'vue'
const activeIndex = ref(null)
const state = reactive({
  curYear: null,
  curMonth: null,
  curDate: null,
  dateCount: [],
})

// 计算属性
const title = computed(() => {
  return `${state.curYear}年${state.curMonth + 1}月`
})
// 模拟打卡数据 - 实际应该从 API 获取
const timeStore = useTimeStore()

// 图例项
const legendItems = ref([
  { color: '#ffffff', label: '0-10' },
  { color: '#ffdeeb', label: '11-30' },
  { color: '#fcc2d7', label: '31-40' },
  { color: '#faa2c1', label: '41-80' },
  { color: '#f783ac', label: '81+' },
])

let curYEAR = new Date().getFullYear()
let curMONTH = new Date().getMonth()
// 生成日历天数数组
onMounted(() => {
  const today = new Date()
  state.curYear = today.getFullYear()
  state.curMonth = today.getMonth()
  state.curDate = today.getDate()

  getDateCount()
})

const getDateCount = () => {
  const count = new Date(
    state.curYear,
    state.curMonth + 1,
    0,
  ).getDate()
  const firstDay = new Date(state.curYear, state.curMonth, 1).getDay()
  for (let i = 1; i <= count + firstDay; i++) {
    let val = i - firstDay
    state.dateCount.push(val)
  }
}

const filterDate = (date) => {
  return date > 0 ? date : null
}

const isToday = (date) => {
  return (
    state.curYear === curYEAR &&
    state.curMonth === curMONTH &&
    date === state.curDate
  )
}

// 获取日期字符串（YYYY-MM-DD格式）
const getDateString = (date) => {
  if (date <= 0) return null
  // 修复：确保月份和日期都是两位数
  const month = (state.curMonth + 1).toString().padStart(2, '0')
  const day = date.toString().padStart(2, '0')
  return `${state.curYear}-${month}-${day}`
}
// 获取某天的颜色
const getDayColor = (date) => {
  const dateStr = getDateString(date)
  const count =
    timeStore.focusTime.find((item) => item.date === dateStr)?.time ||
    0

  if (count === 0) return '#ffffff'
  if (count <= 20) return '#ffdeeb'
  if (count <= 40) return '#fcc2d7'
  if (count <= 60) return '#faa2c1'
  return '#f783ac'
}

const changeM = (type) => {
  state.dateCount = []
  if (type === 'prev') {
    state.curMonth--
    if (state.curMonth < 0) {
      state.curMonth = 11
      state.curYear--
    }
  } else {
    state.curMonth++
    if (state.curMonth > 11) {
      state.curMonth = 0
      state.curYear++
    }
  }
  getDateCount()
}
// // 获取某天的提示信息
// const getDayTitle = (date) => {
//   const dateStr = getDateString(date)
//   const count = focusData.value[dateStr] || 0
//   return `${dateStr}: ${count}次专注`
// }
</script>

<template>
  <div class="mini-calendar">
    <!-- 月份切换头部 -->
    <div class="calendar-header">
      <button
        class="nav-button"
        @click="changeM('prev')"
        title="上个月"
      >
        ◀
      </button>
      <h3>{{ title }}</h3>
      <button
        class="nav-button"
        @click="changeM('next')"
        title="下个月"
      >
        ▶
      </button>
    </div>

    <div class="calendar-weekdays">
      <div
        v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
        :key="day"
        class="weekday"
      >
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(day, index) in state.dateCount"
        :key="index"
        class="calendar-day"
        @click="activeIndex = index"
      >
        <div class="day-content">
          <div
            class="day-number"
            :class="{
              'day-indicator': day > 0,
              today:
                activeIndex === index
                  ? true
                  : isToday(day) && activeIndex === null,
            }"
            :style="{ backgroundColor: getDayColor(day) }"
          >
            {{ filterDate(day) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <div
        class="legend-item"
        v-for="item in legendItems"
        :key="item.label"
      >
        <div
          class="legend-color"
          :style="{ backgroundColor: item.color }"
        ></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-calendar {
  max-width: 300px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.calendar-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  text-align: center;
}

.nav-button {
  background: none;
  border: none;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background-color: #f7fafc;
  color: #2d3748;
  transform: scale(1.1);
}

.nav-button:active {
  transform: scale(0.95);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 11px;
  color: #718096;
  padding: 4px 0;
  font-weight: 500;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.calendar-day {
  aspect-ratio: 1;
  min-height: 26px;
  position: relative;
}

.day-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-number {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 9px;
  color: #4a5568;
  z-index: 2;
  font-weight: 500;
}

.day-indicator {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.day-indicator:hover {
  transform: scale(1.12);
  box-shadow: 0 0 0 2px #d6336c76;
  z-index: 3;
}

.other-month .day-indicator {
  opacity: 0.4;
}

.other-month .day-number {
  opacity: 0.5;
}

.today .day-number {
  color: #2a3f52;
  font-weight: 700;
}

.today {
  border: 2px solid #f06595;
}

/* 图例样式 */
.legend {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-item span {
  font-size: 9px;
  color: #718096;
  font-weight: 500;
}
</style>
