<!-- 创建时间：2025-10-06 15:17 -->
<!-- 功能： -->
<!-- 文件名：Documentation.vue -->
<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { responsiveSidebar } from '../composable/responsiveSideBar'
import MarkdownViewer from '@/components/MarkDownViewer.vue'
const { isMobile } = responsiveSidebar()
const props = defineProps({
  initialFile: {
    type: String,
    default: '',
  },
})
const drawer = ref(false)
const toggleDrawer = () => {
  drawer.value = !drawer.value
}
// 获取所有Markdown文件
const markdownFiles = ref([])
const filteredFiles = ref([])
const currentFile = ref(null)
const searchQuery = ref('')

// 格式化文件名为显示名称
const formatDisplayName = (fileName) => {
  return fileName
    .replace(/-/g, ' ')
    .replace(/\.md$/, '')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

// 初始化文件列表
const initFiles = async () => {
  try {
    const basePath = import.meta.env.BASE_URL
    if (props.initialFile) {
      const target = markdownFiles.value.find(
        (f) =>
          f.name === `${props.initialFile}.md` ||
          f.name === props.initialFile,
      )
      if (target) currentFile.value = target.path
    }
    // 使用import.meta.glob获取所有md文件
    const modules = import.meta.glob('/public/markdown/*.md', {
      eager: false,
    })

    markdownFiles.value = Object.keys(modules).map((path) => {
      const fileName = path.split('/').pop()
      return {
        name: fileName,
        displayName: formatDisplayName(fileName),
        path: `/public/markdown/${fileName}`,
        isNew: fileName.includes('new-'), // 示例：标记新文件
      }
    })

    filteredFiles.value = [...markdownFiles.value]

    // 默认选择第一个文件
    if (filteredFiles.value.length > 0) {
      currentFile.value = filteredFiles.value[0].path
    }
  } catch (err) {
    console.error('初始化文件列表失败:', err)
  }
}

// 过滤文件
const filterFiles = () => {
  if (!searchQuery.value) {
    filteredFiles.value = [...markdownFiles.value]
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredFiles.value = markdownFiles.value.filter(
    (file) =>
      file.displayName.toLowerCase().includes(query) ||
      file.name.toLowerCase().includes(query),
  )
}

// 选择文件
const selectFile = (path) => {
  currentFile.value = path
  // 可以在这里添加路由变化或历史记录
}

onMounted(initFiles)
</script>

<template>
  <div class="documentation-container">
    <div v-if="isMobile">
      <div
        @click="toggleDrawer"
        style="
          font-size: 18px;
          cursor: pointer;
          position: fixed;
          background-color: #fffdfe;
          border: 1px solid #d21982;
          color: #d21982;
          border-radius: 50%;
          padding: 8px 12px;
        "
      >
        ☰
      </div>
      <el-drawer v-model="drawer" size="230px" :with-header="false">
        <div style="width: 200px; font-size: 13.5px">
          <div class="search-box">
            <input
              style="outline: none"
              v-model="searchQuery"
              placeholder="搜索文档..."
              @input="filterFiles"
            />
          </div>
          <div class="menu">
            <div
              v-for="file in filteredFiles"
              :key="file.name"
              class="menu-item"
              :class="{ active: currentFile === file.path }"
              @click="selectFile(file.path)"
            >
              {{ file.displayName }}
              <span v-if="file.isNew" class="new-badge">NEW</span>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>

    <div v-else class="sidebar">
      <div
        style="
          position: fixed;
          width: 240px;
          background-color: #fffdfe;
          height: 100vh;
          overflow: auto;
        "
      >
        <div class="search-box">
          <input
            style="outline: none"
            v-model="searchQuery"
            placeholder="搜索文档..."
            @input="filterFiles"
          />
        </div>
        <div class="menu">
          <div
            v-for="file in filteredFiles"
            :key="file.name"
            class="menu-item"
            :class="{ active: currentFile === file.path }"
            @click="selectFile(file.path)"
          >
            {{ file.displayName }}
            <span v-if="file.isNew" class="new-badge">NEW</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <MarkdownViewer v-if="currentFile" :file-path="currentFile" />
    </div>
  </div>
</template>

<style scoped>
.documentation-container {
  display: flex;
  min-height: 100vh;
  overflow: auto;
}

.sidebar {
  width: 240px;
  color: #595959;
  height: 100vh;
  background: #fffdfe;
  /* border-right: 1px solid #e1e4e8; */
  transition: transform 0.3s ease;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.content {
  width: 1000px;
  padding: 10px;
  margin-left: 250px;
}

.search-box {
  display: block;
  width: 100%;
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 8px 0;
  padding-left: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item:hover {
  background-color: #ff98cd38;
  color: #262626;
}

.menu-item.active {
  background-color: #ff98cd38;
  color: #d21982;
  font-weight: 500;
}

.new-badge {
  background-color: #ff5722;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

.markdown-body {
  line-height: 1.6;
}

.markdown-body :deep(*) {
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .content {
    max-width: 100%;
    margin-left: 0;
    padding: 16px;
  }

  .documentation-container {
    flex-direction: column;
  }
}
</style>
