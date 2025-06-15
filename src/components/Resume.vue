<template>
  <div class="resume-container">
    <a-card title="履歷管理" :bordered="false">
      <a-form
        :model="formState"
        name="resume"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-divider>基本資料</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              name="name"
              :rules="[{ required: true, message: '請輸入姓名' }]"
            >
              <a-input v-model:value="formState.name" placeholder="姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              name="phone"
              :rules="[{ required: true, message: '請輸入電話' }]"
            >
              <a-input v-model:value="formState.phone" placeholder="電話" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>教育背景</a-divider>
        <div v-for="(edu, index) in formState.education" :key="index" class="form-item">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                :name="['education', index, 'school']"
                :rules="[{ required: true, message: '請輸入學校' }]"
              >
                <a-input v-model:value="edu.school" placeholder="學校" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :name="['education', index, 'major']"
                :rules="[{ required: true, message: '請輸入科系' }]"
              >
                <a-input v-model:value="edu.major" placeholder="科系" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item
                :name="['education', index, 'period']"
                :rules="[{ required: true, message: '請輸入期間' }]"
              >
                <a-input v-model:value="edu.period" placeholder="期間" />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-button type="link" @click="removeEducation(index)">
                <delete-outlined />
              </a-button>
            </a-col>
          </a-row>
        </div>
        <a-button type="dashed" block @click="addEducation">
          <plus-outlined /> 添加教育經歷
        </a-button>

        <a-divider>工作經驗</a-divider>
        <div v-for="(exp, index) in formState.experience" :key="index" class="form-item">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item
                :name="['experience', index, 'company']"
                :rules="[{ required: true, message: '請輸入公司' }]"
              >
                <a-input v-model:value="exp.company" placeholder="公司" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :name="['experience', index, 'position']"
                :rules="[{ required: true, message: '請輸入職位' }]"
              >
                <a-input v-model:value="exp.position" placeholder="職位" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item
                :name="['experience', index, 'period']"
                :rules="[{ required: true, message: '請輸入期間' }]"
              >
                <a-input v-model:value="exp.period" placeholder="期間" />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-button type="link" @click="removeExperience(index)">
                <delete-outlined />
              </a-button>
            </a-col>
          </a-row>
          <a-form-item
            :name="['experience', index, 'description']"
            :rules="[{ required: true, message: '請輸入工作內容' }]"
          >
            <a-textarea v-model:value="exp.description" placeholder="工作內容" :rows="4" />
          </a-form-item>
        </div>
        <a-button type="dashed" block @click="addExperience">
          <plus-outlined /> 添加工作經歷
        </a-button>

        <a-divider>技能專長</a-divider>
        <a-form-item
          name="skills"
          :rules="[{ required: true, message: '請輸入技能專長' }]"
        >
          <a-textarea
            v-model:value="formState.skills"
            placeholder="請輸入您的技能專長，用逗號分隔"
            :rows="4"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block>
            保存履歷
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formState = reactive({
  name: '',
  phone: '',
  education: [],
  experience: [],
  skills: ''
});

const addEducation = () => {
  formState.education.push({
    school: '',
    major: '',
    period: ''
  });
};

const removeEducation = (index) => {
  formState.education.splice(index, 1);
};

const addExperience = () => {
  formState.experience.push({
    company: '',
    position: '',
    period: '',
    description: ''
  });
};

const removeExperience = (index) => {
  formState.experience.splice(index, 1);
};

const fetchResume = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('請先登入');
      router.push('/login');
      return;
    }

    const response = await fetch('https://interviewback.zeabur.app/api/resume', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      formState.name = data.name || '';
      formState.phone = data.phone || '';
      // 處理 skills 格式
      formState.skills = Array.isArray(data.skills) ? data.skills.join(', ') : 
                        typeof data.skills === 'string' ? data.skills : '';
      formState.education = Array.isArray(data.education) ? data.education : [];
      formState.experience = Array.isArray(data.experience) ? data.experience : [];
      
      if (formState.education.length === 0) {
        addEducation();
      }
      if (formState.experience.length === 0) {
        addExperience();
      }
    } else {
      const error = await response.json();
      if (error.error === 'Token已過期' || error.error === '無效的Token') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.error('登入已過期，請重新登入');
        router.push('/login');
      } else if (error.error === '履歷不存在') {
        message.info('請填寫您的履歷資料');
        addEducation();
        addExperience();
      } else {
        message.error(error.error || '獲取履歷失敗');
      }
    }
  } catch (error) {
    console.error('獲取履歷失敗:', error);
    message.error('獲取履歷失敗');
  }
};

const onFinish = async (values) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('請先登入');
      router.push('/login');
      return;
    }

    const formData = {
      name: values.name,
      phone: values.phone,
      // 確保 skills 以正確的格式發送
      skills: values.skills.trim(),
      education: values.education || [],
      experience: values.experience || []
    };

    const response = await fetch('https://interviewback.zeabur.app/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      const data = await response.json();
      formState.name = data.name || '';
      formState.phone = data.phone || '';
      formState.skills = data.skills || '';
      formState.education = Array.isArray(data.education) ? data.education : [];
      formState.experience = Array.isArray(data.experience) ? data.experience : [];
      
      message.success('履歷保存成功');
    } else {
      const error = await response.json();
      if (error.error === 'Token已過期' || error.error === '無效的Token') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.error('登入已過期，請重新登入');
        router.push('/login');
      } else {
        message.error(error.error || '保存失敗');
      }
    }
  } catch (error) {
    console.error('保存失敗:', error);
    message.error('保存失敗');
  }
};

onMounted(() => {
  fetchResume();
});
</script>

<style scoped>
.resume-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.resume-container :deep(.ant-card) {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.resume-container :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
}

.resume-container :deep(.ant-card-head-title) {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.resume-container :deep(.ant-divider) {
  margin: 24px 0;
  color: #1a1a1a;
  font-weight: 500;
}

.form-item {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.form-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.resume-container :deep(.ant-input),
.resume-container :deep(.ant-input-textarea) {
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s ease;
}

.resume-container :deep(.ant-input:hover),
.resume-container :deep(.ant-input-textarea:hover) {
  border-color: #40a9ff;
}

.resume-container :deep(.ant-input:focus),
.resume-container :deep(.ant-input-focused),
.resume-container :deep(.ant-input-textarea:focus),
.resume-container :deep(.ant-input-textarea-focused) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.resume-container :deep(.ant-btn) {
  border-radius: 6px;
  height: 40px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.resume-container :deep(.ant-btn-primary) {
  background: #1890ff;
  border-color: #1890ff;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}

.resume-container :deep(.ant-btn-primary:hover) {
  background: #40a9ff;
  border-color: #40a9ff;
}

.resume-container :deep(.ant-btn-dashed) {
  color: #1890ff;
  border-color: #1890ff;
}

.resume-container :deep(.ant-btn-dashed:hover) {
  color: #40a9ff;
  border-color: #40a9ff;
}

.resume-container :deep(.ant-btn-link) {
  color: #ff4d4f;
}

.resume-container :deep(.ant-btn-link:hover) {
  color: #ff7875;
}

.resume-container :deep(.ant-form-item-label > label) {
  color: #1a1a1a;
  font-weight: 500;
}

.resume-container :deep(.ant-form-item-explain-error) {
  color: #ff4d4f;
}

.resume-container :deep(.ant-input::placeholder),
.resume-container :deep(.ant-input-textarea::placeholder) {
  color: #bfbfbf;
}
</style>