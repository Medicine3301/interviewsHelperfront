<template>
  <a-layout>
    <a-layout-header v-if="showHeader">
      <div class="logo">面試助手</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item v-for="route in authRoutes" :key="route.name">
          <router-link :to="route.path">
            <component :is="route.meta.icon + '-outlined'" />
            {{ route.meta.title }}
          </router-link>
        </a-menu-item>
        <a-menu-item key="logout" @click="handleLogout">
          <logout-outlined />
          登出
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content class="content">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="route.path" @login="checkAuth" @logout="checkAuth" />
          </keep-alive>
        </router-view>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Interviews Helper ©2024 Created by Your Team
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { HomeOutlined, UserOutlined, FileTextOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const selectedKeys = ref([route.name])

// 修改認證狀態的計算邏輯
const showHeader = computed(() => {
  const token = localStorage.getItem('token')
  const isLoginPage = route.path === '/login'
  return token && !isLoginPage
})

const authRoutes = [
  {
    name: 'Home',
    path: '/',
    meta: {
      title: '首頁',
      icon: 'Home'
    }
  },
  {
    name: 'resume',
    path: '/resume',
    meta: {
      title: '履歷管理',
      icon: 'FileText'
    }
  },
  {
    name: 'interview',
    path: '/interview',
    meta: {
      title: '面試練習',
      icon: 'User'
    }
  },
  {
    name: 'history',
    path: '/history',
    meta: {
      title: '歷史記錄',
      icon: 'History'
    }
  }
]

const checkAuth = () => {
  const token = localStorage.getItem('token')
  if (!token && route.meta.requiresAuth) {
    router.push('/login')
  }
  selectedKeys.value = [route.name]
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  message.success('已登出')
  router.push('/login')
}

// 監聽路由變化
watch(() => route.path, () => {
  checkAuth()
}, { immediate: true })

onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  color: white;
  font-size: 20px;
  font-weight: bold;
  line-height: 31px;
}

.content {
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: #f0f2f5;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 24px;
  min-height: 280px;
  border-radius: 4px;
}

.ant-menu-item {
  display: flex;
  align-items: center;
}

.ant-menu-item a {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

<!-- 根组件：作为整个应用的容器，使用 router-view 显示当前路由对应的组件 -->

<!--
這是主應用組件。
它只包含一個<router-view>組件,用於顯示當前路由對應的組件。
樣式部分引入了全局樣式文件style.css。
-->