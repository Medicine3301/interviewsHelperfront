<template>
  <div class="login-container">
    <a-card class="login-card" :bordered="false">
      <template #title>
        <h2>{{ isLogin ? '登入' : '註冊' }}</h2>
      </template>
      
      <a-form
        :model="formState"
        name="basic"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '請輸入用戶名' }]"
        >
          <a-input v-model:value="formState.username" placeholder="用戶名" />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '請輸入密碼' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="密碼" />
        </a-form-item>

        <a-form-item
          v-if="!isLogin"
          name="email"
          :rules="[
            { required: true, message: '請輸入電子郵件' },
            { type: 'email', message: '請輸入有效的電子郵件' }
          ]"
        >
          <a-input v-model:value="formState.email" placeholder="電子郵件" />
        </a-form-item>

        <a-form-item
          v-if="!isLogin"
          name="verificationCode"
          :rules="[{ required: true, message: '請輸入驗證碼' }]"
        >
          <div class="verification-code">
            <a-input v-model:value="formState.verificationCode" placeholder="驗證碼" />
            <a-button type="primary" @click="sendVerificationCode">發送驗證碼</a-button>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block>
            {{ isLogin ? '登入' : '註冊' }}
          </a-button>
        </a-form-item>

        <a-form-item>
          <a-button type="link" @click="toggleMode">
            {{ isLogin ? '沒有帳號？立即註冊' : '已有帳號？立即登入' }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogin = ref(true);
const formState = reactive({
  username: '',
  password: '',
  email: '',
  verificationCode: ''
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const sendVerificationCode = async () => {
  try {
    const response = await fetch('https://interviewback.zeabur.app/api/send_verification_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formState.email }),
    });
    const data = await response.json();
    if (response.ok) {
      message.success('驗證碼已發送');
    } else {
      message.error(data.error);
    }
  } catch (error) {
    message.error('發送驗證碼失敗');
  }
};

const onFinish = async (values) => {
  try {
    const endpoint = isLogin.value ? '/api/login' : '/api/register';
    const response = await fetch(`https://interviewback.zeabur.app${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    
    if (response.ok) {
      if (isLogin.value) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        message.success('登入成功');
        router.push('/');
      } else {
        message.success('註冊成功');
        isLogin.value = true;
      }
    } else {
      message.error(data.error || (isLogin.value ? '登入失敗' : '註冊失敗'));
    }
  } catch (error) {
    message.error(isLogin.value ? '登入失敗' : '註冊失敗');
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.verification-code {
  display: flex;
  gap: 10px;
}

.verification-code .ant-input {
  flex: 1;
}
</style> 