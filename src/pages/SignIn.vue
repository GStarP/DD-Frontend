<template>
  <div class="sign-in">
    <Logo />
    <el-card class="sign-in-card">
      <div class="input-group">
        <div class="input-group__title">Username</div>
        <el-input
          class="input-group__input"
          size="large"
          v-model="usernameInput"
        ></el-input>
      </div>
      <div class="input-group">
        <div class="input-group__title">Password</div>
        <el-input
          class="input-group__input"
          size="large"
          type="password"
          show-password
          v-model="passwordInput"
        ></el-input>
      </div>
      <el-link class="no-account" @click="toSignUpPage"
        >do not have an account?</el-link
      >
      <div class="btn-container">
        <el-button type="primary" size="large">Sign In</el-button>
        <el-divider>OR</el-divider>
        <el-button
          class="icon-btn"
          color="#000"
          size="large"
          style="color: #fff;"
          @click="signUpWithGithub"
        >
          <img :src="githubIcon" />
          Sign In with GitHub</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import Logo from '@/components/Logo.vue';
import router from '@/plugins/router';
import { ref } from 'vue';

import githubIcon from '@/assets/github.png';
import { ElMessage } from 'element-plus';

const usernameInput = ref('');
const passwordInput = ref('');

const toSignUpPage = () => {
  router.push({ path: '/sign-up' });
};

const signUpWithGithub = () => {
  ElMessage.warning('to be continued');
};
</script>

<style lang="scss">
.sign-in {
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
