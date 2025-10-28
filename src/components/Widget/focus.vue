<script setup lang="ts">
import { useTimeStore } from '@/stores'
import { onUnmounted, ref } from 'vue'

const started = ref(false)
const currentImg = ref(true)
const timer = ref(0)
const top = ref(-80)
const paused = ref(false)
let animTimeout: ReturnType<typeof setTimeout> | null = null
let animInterval: ReturnType<typeof setInterval> | null = null
let timeInterval: ReturnType<typeof setInterval> | null = null
const timeStore = useTimeStore()

const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
const start = () => {
  if (started.value) return
  started.value = true
  timer.value = 0
  currentImg.value = true
  top.value = -80
  animInterval = setInterval(() => {
    currentImg.value = !currentImg.value
    top.value = currentImg.value ? -80 : -75
  }, 500)
  timeInterval = setInterval(() => {
    timer.value++
  }, 1000)
}
const stop = () => {
  if (!started.value) return
  started.value = false
  timeStore.setFocusTime(
    new Date().toISOString().split('T')[0],
    timer.value / 60,
  )
  console.log(
    '🚀 ~ stop ~ new Date().toISOString():',
    new Date().toISOString(),
  )
  if (animTimeout) clearTimeout(animTimeout)
  if (animInterval) clearInterval(animInterval)
  if (timeInterval) clearInterval(timeInterval)
  timer.value = 0
  currentImg.value = true
  top.value = -80
}

const pause = () => {
  if (animTimeout) clearTimeout(animTimeout)
  if (animInterval) clearInterval(animInterval)
  if (timeInterval) clearInterval(timeInterval)
  paused.value = !paused.value
}

const continueFn = () => {
  paused.value = false
  animInterval = setInterval(() => {
    currentImg.value = !currentImg.value
    top.value = currentImg.value ? -80 : -75
  }, 500)
  timeInterval = setInterval(() => {
    timer.value++
  }, 1000)
}

onUnmounted(() => {
  if (animTimeout) clearTimeout(animTimeout)
  if (animInterval) clearInterval(animInterval)
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<template>
  <div style="display: flex">
    <div>
      <div style="cursor: pointer" v-if="!started">
        <img
          style="width: 160px"
          src="../../assets/image/pixil-frame-0.png"
          alt=""
        />
      </div>
      <div v-else>
        <img
          style="width: 160px"
          v-if="currentImg"
          src="../../assets/image/pixil-frame-1.png"
          alt=""
        />
        <img
          style="width: 160px"
          v-else
          src="../../assets/image/pixil-frame-2.png"
          alt=""
        />
        <div
          :style="{
            fontFamily: `'Press Start 2P', cursive`,
            fontSize: '16px',
            fontWeight: 500,
            position: 'relative',
            top: top + 'px',
            left: '45px',
          }"
        >
          {{ formatTime(timer) }}
        </div>
      </div>
    </div>
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
      "
    >
      <div
        style="
          margin-left: 20px;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          gap: 10px;
          margin-top: 10px;
        "
      >
        <button
          v-if="!started"
          class="btn"
          style="background-color: #8ebd20"
          @click="start"
        >
          start
        </button>
        <div v-else>
          <button
            v-if="!paused"
            class="btn"
            style="background-color: #e02a29"
            @click="pause"
          >
            pause
          </button>
          <button
            v-else
            @click="continueFn"
            class="btn"
            style="background-color: #e02a29"
          >
            continue
          </button>
        </div>

        <button
          @click="stop"
          class="btn"
          style="background-color: #f8e22d"
        >
          stop
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  margin-left: 15px;
  cursor: pointer;
  height: 40px;
  padding: 0 5px;
  border: 3px solid;
  font-family: 'Press Start 2P', cursive;
}
.btn:hover {
}
</style>
