import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTimeStore = defineStore(
  'time',
  () => {
    const focusTime = ref([])

    const setFocusTime = (date, time) => {
      const index = focusTime.value.findIndex(
        (item) => item.date === date,
      )
      if (index !== -1) {
        focusTime.value[index].time += time
      } else {
        focusTime.value.push({ date, time })
      }
    }
    return { focusTime, setFocusTime }
  },
  {
    persist: true,
  },
)
