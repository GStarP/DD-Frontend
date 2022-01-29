<template>
  <div class="profile-user">
    <div class="profile-user__header">
      <el-icon class="profile-user-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="profile-user-title">
        User Profile
      </div>
      <span style="width: 32px; height: 1px;"></span>
    </div>
    <div class="profile-user__main">
      <div class="user-profile">
        <div class="user-profile__main">
          <el-avatar class="user-profile-avatar"></el-avatar>
          <div class="user-profile-info">
            <div class="user-profile-name">{{ userInfo.userName }}</div>
            <div class="user-profile-id">ID: {{ userInfo.userId }}</div>
          </div>
          <div class="user-profile__actions">
            <el-icon v-if="isSelf" :size="32" @click="reqEditProfile"
              ><edit
            /></el-icon>
            <template v-else>
              <template v-if="!userInfo.isFriend">
                <el-icon :size="32" @click="addFriend"><CirclePlus /></el-icon>
              </template>
              <template v-else>
                <el-icon :size="30" @click="delFriend" color="#F56C6C"
                  ><Delete
                /></el-icon>
                <el-icon
                  v-if="userInfo.isBlacked"
                  :size="32"
                  @click="unblackenFriend"
                  ><CircleCheck
                /></el-icon>
                <el-icon v-else :size="32" @click="blackenFriend"
                  ><Remove
                /></el-icon>
              </template>
            </template>
          </div>
        </div>
        <div class="user-profile__attr">
          <span>Nickname</span>{{ userInfo.userName }}
        </div>
        <div class="user-profile__attr">
          <span>Email</span>{{ userInfo.email }}
        </div>
        <div class="user-profile__attr">
          <span>Phone</span>{{ userInfo.phone }}
        </div>
        <div class="user-profile__attr">
          <span>Gender</span>{{ userInfo.gender ? 'Woman' : 'Man' }}
        </div>
        <div class="user-profile__attr"><span>Age</span>{{ userInfo.age }}</div>
      </div>
      <el-dialog
        class="edit-profile"
        v-model="editShow"
        width="480px"
        title="Edit Profile"
        :close-on-click-modal="false"
      >
        <div class="edit-profile__attr">
          <span>Username</span>
          <el-input size="large" v-model="userInfoInput.userName"></el-input>
        </div>
        <div class="edit-profile__attr">
          <span>Email</span>
          <el-input size="large" v-model="userInfoInput.email"></el-input>
        </div>
        <div class="edit-profile__attr">
          <span>Phone</span>
          <el-input size="large" v-model="userInfoInput.phone"></el-input>
        </div>
        <div class="edit-profile__attr">
          <span>Gender</span>
          <el-select
            :model-value="userInfoInput.gender ? 'Woman' : 'Man'"
            size="large"
            @change="selectGender($event)"
          >
            <el-option label="Man" value="Man"></el-option>
            <el-option label="Woman" value="Woman"></el-option>
          </el-select>
        </div>
        <div class="edit-profile__attr">
          <span>Age</span>
          <el-input
            type="number"
            size="large"
            v-model="userInfoInput.age"
          ></el-input>
        </div>
        <el-button
          class="edit-profile-submit"
          type="primary"
          size="large"
          @click="submitEditProfile"
          >Submit</el-button
        >
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import {
  ArrowLeft,
  CirclePlus,
  Edit,
  Delete,
  Remove,
  CircleCheck
} from '@element-plus/icons-vue';
import router from '@/plugins/router';
import { computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive } from 'vue';
// 获取路由参数
const route = useRoute();
const userId = parseInt(route.params.id as string);
// 获取用户信息
let userInfo: UserInfo;
// 判断当前查看的用户是否是自己
const store = useStore();
const isSelf = computed(() => store.state.uid === userId);
// mock
userInfo = {
  userId: 1,
  userName: 'Feng Liu',
  email: 'fengliu@nju.com',
  phone: '18762735835',
  gender: 0,
  age: 30,
  isFriend: userId % 2 == 0,
  isBlacked: userId % 3 == 0
} as UserInfo;
/**
 * 顶部栏
 */
const back = () => {
  router.back();
};
/**
 * 用户信息
 */
// 编辑资料
const reqEditProfile = () => {
  editShow.value = true;
};
// 编辑资料弹窗
const editShow = ref(false);
let userInfoInput = reactive(userInfo);
// 被迫自定义愚蠢的下拉框
const selectGender = (newVal: string) => {
  if (newVal === 'Man') {
    userInfoInput.gender = 0;
  } else {
    userInfoInput.gender = 1;
  }
  console.log(userInfoInput);
};
// 提交资料编辑
const submitEditProfile = () => {
  ElMessage.info(JSON.stringify(userInfoInput));
  editShow.value = false;
};
// 添加好友
const addFriend = () => {
  ElMessage.info('add friend');
};
// 删除好友
const delFriend = () => {
  ElMessageBox.confirm(
    `Are you sure to delete your friend ${userInfo.userName}?`,
    'Delete Friend'
  ).then(() => {
    ElMessage.info('deleted');
  });
};
// 拉黑/释放
const blackenFriend = () => {
  ElMessageBox.confirm(
    `Are you sure to send your friend ${userInfo.userName} to black list?`,
    'Blacken Friend'
  ).then(() => {
    ElMessage.info('blacked');
  });
};
const unblackenFriend = () => {
  ElMessageBox.confirm(
    `Are you sure to release your friend ${userInfo.userName} from black list?`,
    'Unblacken Friend'
  ).then(() => {
    ElMessage.info('blacked');
  });
};
</script>

<style lang="scss">
.profile-user {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__header {
    height: 64px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 16px;
  }
  &-back {
    transition: color 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  &-title {
    font-size: 20px;
  }
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 36px 0;
  }
  .user-profile {
    width: 400px;
    display: flex;
    flex-direction: column;
    &__main {
      display: flex;
      flex-direction: row;
      margin-bottom: 16px;
    }
    &-info {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
    }
    &-name {
      font-size: 20px;
      height: 32px;
    }
    &-id {
      font-size: 15px;
    }

    &__actions {
      margin-left: auto;
      display: flex;
      flex-direction: row;
      > i {
        transition: color 0.3s;
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
      > i:not(:first-child) {
        margin-left: 16px;
      }
    }
    &__attr {
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      font-size: 18px;
      span {
        width: 120px;
        font-weight: 300;
        color: #303133;
      }
    }
  }
  .edit-profile {
    &__attr {
      display: flex;
      flex-direction: column;
      &:not(:first-child) {
        margin-top: 12px;
      }
      > span {
        color: #303133;
        margin-bottom: 6px;
      }
    }
    &-submit {
      width: 100%;
      margin-top: 24px;
    }
  }

  .el-dialog__body {
    padding: 10px 60px 40px 60px;
  }
}
</style>
