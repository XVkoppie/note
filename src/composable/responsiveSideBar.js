import { onMounted, onUnmounted, ref } from 'vue'

export function responsiveSidebar() {
  const isMobile = ref(false)

  const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768
  }
  onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })

  return {
    isMobile,
  }
}
