<template>
  <div class="home-container">
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card class="welcome-card" :bordered="false">
          <template #title>
            <h2>歡迎使用面試助手</h2>
          </template>
          <p>這是一個幫助您準備面試的智能助手，提供以下功能：</p>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" class="feature-cards">
      <a-col :span="8">
        <a-card class="feature-card" hoverable @click="navigateTo('resume')">
          <template #title>
            <user-outlined />
            <span>履歷管理</span>
          </template>
          <p>創建和管理您的履歷，為面試做好準備</p>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card class="feature-card" hoverable @click="navigateTo('interview')">
          <template #title>
            <message-outlined />
            <span>模擬面試</span>
          </template>
          <p>進行模擬面試，獲取即時反饋和建議</p>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card class="feature-card" hoverable @click="navigateTo('history')">
          <template #title>
            <history-outlined />
            <span>歷史記錄</span>
          </template>
          <p>查看過往的面試記錄和分析結果</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { UserOutlined, MessageOutlined, HistoryOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const navigateTo = (path) => {
  router.push(`/${path}`);
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.welcome-card {
  margin-bottom: 24px;
  text-align: center;
}

.welcome-card h2 {
  margin-bottom: 16px;
  color: #1890ff;
}

.feature-cards {
  margin-top: 24px;
}

.feature-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card :deep(.ant-card-head-title) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-card :deep(.anticon) {
  font-size: 24px;
  color: #1890ff;
}
</style> 