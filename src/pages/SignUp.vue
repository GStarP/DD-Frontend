<template>
  <div class="sign-up">
    <Logo />
    <el-card class="sign-up-card">
      <div class="input-group">
        <div class="input-group__title">Email</div>
        <el-input
          class="input-group__input"
          size="large"
          v-model="emailInput"
          placeholder="Full email address"
        ></el-input>
      </div>
      <div class="input-group">
        <div class="input-group__title">Username</div>
        <el-input
          class="input-group__input"
          size="large"
          v-model="usernameInput"
          placeholder="Make a nickname"
        ></el-input>
      </div>
      <div class="input-group">
        <div class="input-group__title">Password</div>
        <el-input
          class="input-group__input"
          size="large"
          v-model="passwordInput"
          type="password"
          show-password
          placeholder="Min Length 6"
        ></el-input>
      </div>
      <el-link class="no-account" @click="toSignInPage"
        >already have an account?</el-link
      >
      <div class="btn-container">
        <el-button type="primary" size="large" @click="confirmSignUp"
          >Sign Up</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import Logo from '@/components/Logo.vue';
import router from '@/plugins/router';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { reqSignUpWithEmail } from '@/api/friend';

// 注册表单
const emailInput = ref('');
const usernameInput = ref('');
const passwordInput = ref('');
// 去登陆
const toSignInPage = () => {
  router.push({ path: '/sign-in' });
};
const signUpToSignIn = (userId: number) => {
  router.push({
    path: '/sign-in',
    query: {
      u: '' + userId
    }
  });
};
// 确认注册
const confirmSignUp = () => {
  if (emailInput.value.length < 1) {
    ElMessage.error('please input email');
  } else if (usernameInput.value.length < 1) {
    ElMessage.error('please input username');
  } else if (passwordInput.value.length < 6) {
    ElMessage.error('password length must be over 6');
  } else {
    reqSignUpWithEmail({
      email: emailInput.value,
      userName: usernameInput.value,
      password: passwordInput.value
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('signed up');
        setTimeout(() => signUpToSignIn(res.data), 500);
      }
    });
  }
};
</script>

<style lang="scss">
.sign-up {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    margin-top: 15vh;
    margin-bottom: 20px;
  }

  &-card {
    width: 400px;
    .el-card__body {
      padding: 40px 40px;
      padding-bottom: 56px;
      display: flex;
      flex-direction: column;
    }
    .no-account {
      margin-top: 8px;
      align-self: flex-end;
    }
    .btn-container {
      display: flex;
      flex-direction: column;
      margin-top: 32px;
      .icon-btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        img {
          $btnIconSize: 24px;
          width: $btnIconSize;
          height: $btnIconSize;
          margin-right: 8px;
        }
      }
      .el-button + .el-button {
        margin-left: 0;
      }
      .el-divider--horizontal {
        margin: 16px 0;
      }
    }
  }
}
.input-group {
  &__title {
    margin-bottom: 8px;
  }
  + .input-group {
    margin-top: 16px;
  }
}
</style>
