<!-- 创建时间：2025-09-17 16:01 -->
<!-- 功能：日历组件 -->
<!-- 文件名：calendar.vue -->
<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

const state = reactive({
  curYear: null,
  curMonth: null,
  curDate: null,
  dateCount: [],
  siginList: [
    { id: '001', date: '2025-10-1' },
    { id: '002', date: '2025-9-11' },
    { id: '003', date: '2025-9-17' },
    { id: '004', date: '2025-9-1' },
    { id: '005', date: '2025-9-15' },
  ],
})
let curYEAR = new Date().getFullYear()
let curMONTH = new Date().getMonth()

onMounted(() => {
  let date = new Date()
  state.curYear = date.getFullYear()
  state.curMonth = date.getMonth()
  state.curDate = date.getDate()

  getDateCount()
})

const getDateCount = () => {
  let count = new Date(state.curYear, state.curMonth + 1, 0).getDate()
  let firstday = new Date(state.curYear, state.curMonth, 1).getDay()
  for (let i = 1; i <= count + firstday; i++) {
    let val = i - firstday
    state.dateCount.push(val)
  }
}

const today = (day) => {
  return (
    day == state.curDate &&
    state.curYear == curYEAR &&
    state.curMonth == curMONTH
  )
}

const filterDay = (date) => {
  return date > 0 ? date : ''
}

const changeY = (type) => {
  state.dateCount = []
  if (type === 'prev') {
    state.curYear--
  } else {
    state.curYear++
  }
  getDateCount()
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

const isShow = (date) => {
  let itemdate = `${state.curYear}-${state.curMonth + 1}-${date}`
  return state.siginList.some((item) => item.date == itemdate)
}

const getTime = computed(() => {
  return `${state.curYear}年${state.curMonth + 1}月`
})
</script>

<template>
  <div
    style="
      width: 260px;
      border: 1px solid #ccc;
      padding: 20px;
      font-size: 13px;
      border-radius: 5px;
    "
  >
    <div
      style="
        cursor: pointer;
        width: 100%;
        display: flex;
        justify-content: space-between;
      "
    >
      <div>
        <span @click="changeY('prev')">《</span
        ><span @click="changeM('prev')"><</span>
      </div>
      <div>{{ getTime }}</div>
      <div>
        <span @click="changeM('next')">></span
        ><span @click="changeY('next')">》</span>
      </div>
    </div>

    <div>
      <ul
        style="
          list-style: none;
          display: flex;
          justify-content: space-between;
          padding: 0;
        "
      >
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 15px;
        text-align: center;
      "
    >
      <template v-for="(item, index) in state.dateCount" :key="index">
        <div
          :class="{ today: today(item), sign: isShow(item) }"
          style="
            height: 23px;
            line-height: 23px;
            border-radius: 5px;
            :hov;
          "
        >
          <span style="font-size: 10px">{{ filterDay(item) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.today {
  background-color: #ff94b2;
  color: #ffff;
}
.sign {
  border: 1px solid #e446909c;
}
</style>
