<template>
  <div class="history-container">
    <a-card title="面試歷史記錄" :bordered="false">
      <a-list
        v-if="history.length > 0"
        item-layout="vertical"
        :data-source="history"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <span>{{ item.created_at }}</span>
            </template>
            <a-list-item-meta>
              <template #title>
                <h3>{{ item.question }}</h3>
              </template>
            </a-list-item-meta>
            <div class="answer-section">
              <h4>您的回答：</h4>
              <p class="answer-content">{{ item.answer }}</p>
            </div>
            <div class="analysis-section">
              <h4>分析結果：</h4>
              <div class="analysis-content">
                <div class="strengths" v-if="item.analysis.strengths && item.analysis.strengths.length > 0">
                  <h5>優點：</h5>
                  <ul>
                    <li v-for="(strength, idx) in item.analysis.strengths" :key="'strength-' + idx">
                      <a-tag color="green">{{ strength }}</a-tag>
                    </li>
                  </ul>
                </div>
                <div class="weaknesses" v-if="item.analysis.weaknesses && item.analysis.weaknesses.length > 0">
                  <h5>缺點：</h5>
                  <ul>
                    <li v-for="(weakness, idx) in item.analysis.weaknesses" :key="'weakness-' + idx">
                      <a-tag color="red">{{ weakness }}</a-tag>
                    </li>
                  </ul>
                </div>
                <div class="content-analysis">
                  <h5>內容分析：</h5>
                  <p>{{ item.analysis.content_analysis }}</p>
                </div>
              </div>
              <div class="score-display">
                <span>評分：</span>
                <span class="score" :class="getScoreClass(item.score)">{{ item.score }}/100</span>
              </div>
            </div>
            <div class="recommendations-section">
              <h4>改進建議：</h4>
              <a-timeline>
                <a-timeline-item v-for="(rec, idx) in item.recommendations" :key="'rec-' + idx">
                  <template #dot>
                    <a-tag :color="getPriorityColor(rec.priority)">{{ rec.priority }}</a-tag>
                  </template>
                  <div class="recommendation-item">
                    <span class="category">{{ rec.category }}：</span>
                    <span class="suggestion">{{ rec.suggestion }}</span>
                  </div>
                </a-timeline-item>
              </a-timeline>
            </div>
          </a-list-item>
        </template>
      </a-list>
      <a-empty v-else description="暫無歷史記錄" />
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';

const history = ref([]);
const route = useRoute();

const fetchHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('請先登入');
      return;
    }

    const response = await fetch('https://interviewback.zeabur.app/api/history', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.history) {
        history.value = data.history.map(item => {
          try {
            // 確保分數是數字類型
            const score = typeof item.score === 'string' ? parseFloat(item.score) : item.score;
            // 確保日期是字符串
            const created_at = item.created_at || '';
            // 確保 JSON 數據被正確解析
            const analysis = typeof item.analysis === 'string' ? 
              JSON.parse(item.analysis) : 
              (item.analysis || {});
            const recommendations = typeof item.recommendations === 'string' ? 
              JSON.parse(item.recommendations) : 
              (item.recommendations || []);

            return {
              ...item,
              score: score || 0,
              created_at,
              analysis,
              recommendations
            };
          } catch (e) {
            console.error('處理歷史記錄時出錯:', e);
            return null;
          }
        }).filter(item => item !== null);
      }
    } else {
      const error = await response.json();
      if (error.error === 'Token已過期' || error.error === '無效的Token') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.error('登入已過期，請重新登入');
      } else {
        message.error(error.error || '獲取歷史記錄失敗');
      }
    }
  } catch (error) {
    console.error('獲取歷史記錄失敗:', error);
    message.error('獲取歷史記錄失敗');
  }
};

// 監聽路由變化
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/history') {
      fetchHistory();
    }
  }
);

// 當組件被 keep-alive 激活時
onActivated(() => {
  fetchHistory();
});

onMounted(() => {
  fetchHistory();
});

const getScoreClass = (score) => {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case '高':
      return 'red';
    case '中':
      return 'orange';
    case '低':
      return 'green';
    default:
      return 'blue';
  }
};
</script>

<style scoped>
.history-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.answer-section,
.analysis-section,
.recommendations-section {
  margin-top: 16px;
}

.recommendations-section ul {
  padding-left: 20px;
}

.score-display {
  margin-top: 8px;
  font-size: 16px;
}

.score {
  font-weight: bold;
  color: #1890ff;
}

.answer-content {
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

.analysis-content {
  margin-top: 16px;
}

.strengths,
.weaknesses,
.content-analysis {
  margin-bottom: 16px;
}

.strengths h5,
.weaknesses h5,
.content-analysis h5 {
  color: #1890ff;
  margin-bottom: 8px;
}

.strengths ul,
.weaknesses ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.score-display {
  margin-top: 16px;
  font-size: 16px;
}

.score {
  font-weight: bold;
  margin-left: 8px;
}

.score-high {
  color: #52c41a;
}

.score-medium {
  color: #faad14;
}

.score-low {
  color: #f5222d;
}

.recommendation-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category {
  font-weight: bold;
  color: #1890ff;
}

.suggestion {
  color: #666;
}

:deep(.ant-timeline-item-content) {
  padding: 8px 0;
}
</style>
