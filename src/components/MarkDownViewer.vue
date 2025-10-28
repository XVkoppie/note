<!-- 创建时间：2025-10-06 15:18 -->
<!-- 功能： -->
<!-- 文件名：MarkDownViewer.vue -->
<script setup>
import { ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import heatMap from './Widget/heatMap.vue'
import focus from './Widget/focus.vue'
const props = defineProps({
  filePath: {
    type: String,
    required: true,
  },
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value
      } catch (__) {}
    }
    return md.utils.escapeHtml(str)
  },
})

const renderedContent = ref('')
const loading = ref(false)
const error = ref(null)

const loadMarkdown = async () => {
  loading.value = true
  error.value = null

  try {
    // // 动态导入Markdown文件
    // const module = await import(
    //   /* @vite-ignore */ `${props.filePath}?raw`
    // )
    // renderedContent.value = md.render(module.default)
    const fileName = props.filePath.split('/').pop()
    const fullPath = `/public/markdown/${fileName}?raw`

    const response = await fetch(fullPath)
    const content = await response.text()
    renderedContent.value = md.render(content)
  } catch (err) {
    error.value = err.message
    console.error('加载Markdown失败:', err)
  } finally {
    loading.value = false
  }
}

watch(() => props.filePath, loadMarkdown, { immediate: true })
</script>

<template>
  <div class="markdown-viewer">
    <div class="center-box">
      <div class="markdown-body" v-html="renderedContent"></div>
    </div>
    <div class="right-box">
      <div class="heat-map">
        <heatMap></heatMap>
        <!-- <focus></focus> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 暗黑主题容器 */
.markdown-viewer {
  white-space: normal;
  background-color: #fffdfe;
  min-height: 100vh;
  display: flex;
  gap: 30px;
}

.center-box {
  width: 100%;
}
.loading,
.error {
  padding: 20px;
  text-align: center;
  color: #5e5d5d;
}
:deep(.markdown-body) {
  max-width: 100%;
  overflow-wrap: break-word;
}
/* 主内容区域 */
.markdown-body {
  color: #595959;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  line-height: 1.6;
  letter-spacing: 0.02em;
  overflow-wrap: break-word;
  word-break: break-all;
}
.center-box {
  flex: 6;
}

.right-box {
  flex: 2;
}
.heat-map {
  position: fixed;
  width: 280px;
}

/* 标题样式 */
.markdown-body :deep(h1) {
  color: #4d4d4d;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #3a3a3a;
  margin-top: 1.5em;
  margin-bottom: 1em;
  font-weight: 600;
}

.markdown-body :deep(h2) {
  color: #4a4a4a;
  border-bottom: 1px solid #3a3a3a;
  padding-bottom: 0.3em;
  margin-top: 1.3em;
  margin-bottom: 0.8em;
  font-weight: 500;
}

.markdown-body :deep(h3) {
  color: #6d6d6d;
  margin-top: 1.1em;
  margin-bottom: 0.6em;
  font-weight: 500;
}

/* 段落和文字 */
.markdown-body :deep(p) {
  margin-bottom: 1em;
  font-size: 16px;
}

.markdown-body :deep(a) {
  color: #58a6ff;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(strong) {
  color: #5c5c5c;
  font-weight: 600;
}

.markdown-body :deep(em) {
  color: #595959;
  font-style: italic;
}

/* 代码块样式 */
.markdown-body :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  background-color: #ffeaf5 !important;
  border-radius: 8px;
  padding: 15px;
  margin: 1em 0;
  border: 1px solid #fc3f9160;
  overflow-wrap: break-word;
  word-break: break-all;
}

.markdown-body :deep(code) {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: normal;
}

/* 行内代码 */
.markdown-body :deep(p > code),
.markdown-body :deep(li > code) {
  background-color: #fc3f91ac;
  color: #ffffff;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 90%;
}

/* 列表样式 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 1em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5em;
}

/* 表格样式 */
.markdown-body :deep(table) {
  max-width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  background-color: #ffeaf5;
  border: #fc3f9160;
  border: 1px solid #fc3f9160;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 8px 12px;
  border: 1px solid #fc3f9160;
}

.markdown-body :deep(th) {
  background-color: #ffeaf5;
  color: #f2d;
  color: #6d6d6d;
  font-weight: 600;
}

/* 引用块 */
.markdown-body :deep(blockquote) {
  overflow-wrap: break-word;
  word-break: break-all;
  max-width: 100%;
  border-left: 4px solid #ff6db880;
  padding: 0.2rem 0.5rem;
  color: #454545;
  margin: 1em 0;
  background-color: #fed0e8;
  border-radius: 0 4px 4px 0;
}

/* 水平线 */
.markdown-body :deep(hr) {
  border: none;
  height: 1px;
  background-color: #3a3a3a;
  margin: 2em 0;
}

@media (max-width: 768px) {
  .markdown-viewer {
    margin-left: 0;
    width: 100%;
  }

  .right-box {
    display: none;
  }
}
</style>
