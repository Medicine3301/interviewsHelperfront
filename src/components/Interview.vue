<template>
  <div class="interview-container">
    <a-card title="模擬面試" :bordered="false">
      <a-steps :current="currentStep" class="steps">
        <a-step title="選擇職位" />
        <a-step title="面試問題" />
        <a-step title="回答分析" />
      </a-steps>

      <div class="step-content">
        <!-- 步驟1：選擇職位 -->
        <div v-if="currentStep === 0" class="step-one">
          <a-form
            :model="formState"
            name="position"
            autocomplete="off"
            @finish="onStepOneFinish"
          >
            <a-form-item
              name="industry"
              :rules="[{ required: true, message: '請選擇產業' }]"
            >
              <a-select
                v-model:value="formState.industry"
                placeholder="請選擇產業"
                @change="handleIndustryChange"
              >
                <a-select-option value="tech">科技業</a-select-option>
                <a-select-option value="finance">金融業</a-select-option>
                <a-select-option value="education">教育業</a-select-option>
                <a-select-option value="healthcare">醫療業</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              name="position"
              :rules="[{ required: true, message: '請選擇職位' }]"
            >
              <a-select
                v-model:value="formState.position"
                placeholder="請選擇職位"
              >
                <a-select-option
                  v-for="pos in positions"
                  :key="pos.value"
                  :value="pos.value"
                >
                  {{ pos.label }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              name="company"
              :rules="[{ required: true, message: '請輸入公司名稱' }]"
            >
              <a-input
                v-model:value="formState.company"
                placeholder="請輸入公司名稱"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" block :loading="loading">
                開始面試
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- 步驟2：面試問題 -->
        <div v-if="currentStep === 1" class="step-two">
          <div class="question-card">
            <div class="question-header">
              <div class="question-counter">
                <span class="current">問題 {{ currentQuestionIndex + 1 }}</span>
                <span class="total">/ {{ questions.length }}</span>
              </div>
              <div class="question-info">
                <a-tag color="blue">{{ currentQuestion.type || '一般問題' }}</a-tag>
                <a-tag :color="getDifficultyColor(currentQuestion.difficulty)">
                  難度: {{ currentQuestion.difficulty }}/5
                </a-tag>
              </div>
            </div>
            
            <div class="question-content">
              <div class="question-type">
                <a-tag color="blue">{{ currentQuestion.type || '一般問題' }}</a-tag>
                <a-tag :color="getDifficultyColor(currentQuestion.difficulty)">
                  難度: {{ currentQuestion.difficulty }}/5
                </a-tag>
              </div>
              <div class="question-text">
                <p>{{ currentQuestion.question }}</p>
              </div>
              <div class="question-tips" v-if="currentQuestion.type === '技術'">
                <a-alert
                  message="回答提示"
                  description="請詳細說明您的技術經驗，包括：具體項目經驗、使用的技術棧、解決的問題等。"
                  type="info"
                  show-icon
                />
              </div>
            </div>
            
            <a-form
              :model="answerForm"
              name="answer"
              autocomplete="off"
              @finish="onAnswerSubmit"
              class="answer-form"
            >
              <a-form-item
                name="answer"
                :rules="[{ required: true, message: '請輸入您的回答' }]"
              >
                <a-textarea
                  v-model:value="answerForm.answer"
                  placeholder="請輸入您的回答..."
                  :rows="6"
                  class="answer-textarea"
                />
              </a-form-item>

              <a-form-item class="navigation-buttons">
                <a-space>
                  <a-button
                    v-if="currentQuestionIndex < questions.length - 1"
                    type="primary"
                    html-type="submit"
                    class="nav-button"
                    :loading="loading"
                  >
                    下一題
                    <template #icon><RightOutlined /></template>
                  </a-button>
                  <a-button
                    v-else
                    type="primary"
                    html-type="submit"
                    class="finish-button"
                    :loading="loading"
                    @click="handleFinishInterview"
                  >
                    <template #icon><CheckOutlined /></template>
                    完成面試
                  </a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
        </div>

        <!-- 步驟3：回答分析 -->
        <div v-if="currentStep === 2" class="step-three">
          <a-list
            item-layout="vertical"
            :data-source="analysisResults"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #actions>
                  <span>{{ new Date().toLocaleString() }}</span>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <h3>問題 {{ index + 1 }}</h3>
                  </template>
                </a-list-item-meta>
                <div class="question-section">
                  <h4>問題內容：</h4>
                  <p class="question-content">{{ item.question }}</p>
                </div>
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
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons-vue';

const currentStep = ref(0);
const currentQuestionIndex = ref(0);
const questions = ref([]);
const analysisResults = ref([]);

const formState = reactive({
  industry: '',
  position: '',
  company: ''
});

const answerForm = reactive({
  answer: ''
});

const positions = computed(() => {
  const industryPositions = {
    tech: [
      { value: 'frontend', label: '前端工程師' },
      { value: 'backend', label: '後端工程師' },
      { value: 'fullstack', label: '全端工程師' }
    ],
    finance: [
      { value: 'analyst', label: '金融分析師' },
      { value: 'advisor', label: '理財顧問' }
    ],
    education: [
      { value: 'teacher', label: '教師' },
      { value: 'tutor', label: '家教' }
    ],
    healthcare: [
      { value: 'doctor', label: '醫師' },
      { value: 'nurse', label: '護理師' }
    ]
  };
  return industryPositions[formState.industry] || [];
});

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || '';
});

const handleIndustryChange = () => {
  formState.position = '';
};

const router = useRouter();

const loading = ref(false);

const onStepOneFinish = async (values) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('請先登入');
      router.push('/login');
      return;
    }

    const response = await fetch('https://interviewback.zeabur.app/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(values),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        questions.value = data.questions.map(q => ({
          question: q.question,
          type: q.type || 'general',
          difficulty: q.difficulty || 3
        }));
        currentQuestionIndex.value = 0;
        currentStep.value = 1;
        message.success('問題生成成功');
      } else {
        message.error('未生成任何問題，請稍後再試');
      }
    } else {
      const error = await response.json();
      if (error.error === 'Token已過期' || error.error === '無效的Token') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.error('登入已過期，請重新登入');
        router.push('/login');
      } else if (error.error === '請先建立履歷') {
        message.error('請先建立履歷再進行模擬面試');
        router.push('/resume');
      } else {
        message.error(error.error || '生成問題失敗');
      }
    }
  } catch (error) {
    console.error('生成問題失敗:', error);
    message.error('生成問題失敗，請稍後再試');
  } finally {
    loading.value = false;
  }
};

const onAnswerSubmit = async (values) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const currentQuestionData = questions.value[currentQuestionIndex.value];
    const response = await fetch('https://interviewback.zeabur.app/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        question: currentQuestionData.question,
        answer: values.answer,
        questionType: currentQuestionData.type || 'general',
        difficulty: currentQuestionData.difficulty || 3
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      analysisResults.value[currentQuestionIndex.value] = {
        question: currentQuestionData.question,
        answer: values.answer,
        analysis: data.analysis.content_analysis,
        score: data.score.overall,
        recommendations: data.recommendations.map(rec => ({
          category: rec.category,
          suggestion: rec.suggestion,
          priority: rec.priority
        }))
      };
      answerForm.answer = '';
      
      if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
      } else {
        handleFinishInterview();
      }
    } else {
      const error = await response.json();
      message.error(error.error || '分析回答失敗');
    }
  } catch (error) {
    message.error('分析回答失敗');
  } finally {
    loading.value = false;
  }
};

const handleFinishInterview = async () => {
  if (loading.value) return;
  if (answerForm.answer) {
    loading.value = true;
    try {
      const currentQuestionData = questions.value[currentQuestionIndex.value];
      const response = await fetch('https://interviewback.zeabur.app/api/analyze-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: currentQuestionData.question,
          answer: answerForm.answer,
          questionType: currentQuestionData.type || 'general',
          difficulty: currentQuestionData.difficulty || 3
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        analysisResults.value[currentQuestionIndex.value] = {
          question: currentQuestionData.question,
          answer: answerForm.answer,
          analysis: data.analysis.content_analysis,
          score: data.score.overall,
          recommendations: data.recommendations.map(rec => ({
            category: rec.category,
            suggestion: rec.suggestion,
            priority: rec.priority
          }))
        };
        currentStep.value = 2;
      } else {
        const error = await response.json();
        message.error(error.error || '分析回答失敗');
      }
    } catch (error) {
      message.error('分析回答失敗');
    } finally {
      loading.value = false;
    }
  } else {
    message.warning('請先完成回答');
  }
};

const getScoreClass = (score) => {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
};

const getDifficultyColor = (difficulty) => {
  if (difficulty <= 2) return 'green';
  if (difficulty <= 4) return 'orange';
  return 'red';
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
.interview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.steps {
  margin-bottom: 32px;
}

.step-content {
  min-height: 400px;
}

.question-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.question-counter {
  font-size: 18px;
  font-weight: 500;
}

.question-counter .current {
  color: #1890ff;
  font-size: 24px;
  font-weight: 600;
}

.question-counter .total {
  color: #666;
}

.question-info {
  display: flex;
  gap: 8px;
}

.question-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.question-type {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.question-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
}

.question-text p {
  margin: 0;
  white-space: pre-wrap;
}

.question-tips {
  margin-top: 16px;
}

:deep(.ant-alert) {
  border-radius: 6px;
}

:deep(.ant-alert-info) {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

:deep(.ant-alert-message) {
  color: #1890ff;
  font-weight: 500;
}

:deep(.ant-alert-description) {
  color: #666;
  margin-top: 4px;
}

.step-three {
  margin-top: 24px;
}

.question-section,
.answer-section,
.analysis-section,
.recommendations-section {
  margin-top: 16px;
}

.question-content,
.answer-content {
  white-space: pre-wrap;
  line-height: 1.6;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  margin-top: 8px;
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

:deep(.ant-list-item) {
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.ant-list-item-meta-title) {
  margin-bottom: 8px;
}

:deep(.ant-list-item-meta-title h3) {
  margin: 0;
  color: #1890ff;
}

.answer-form {
  margin-top: 24px;
}

.answer-textarea {
  border-radius: 6px;
  resize: none;
}

.answer-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.navigation-buttons {
  margin-top: 24px;
  text-align: center;
}

.nav-button {
  min-width: 120px;
}

.finish-button {
  min-width: 140px;
  background: #52c41a;
  border-color: #52c41a;
}

.finish-button:hover {
  background: #73d13d;
  border-color: #73d13d;
}
</style>