<template>
  <div class="profile-user">
    <div class="profile-user__header">
      <el-icon class="profile-user-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="profile-user-title">User Profile</div>
      <span style="width: 32px; height: 1px"></span>
    </div>
    <div class="profile-user__main">
      <div class="user-profile">
        <div class="user-profile__main">
          <el-avatar
            class="user-profile-avatar"
            :style="`font-size: 24px;background-color: ${generateAvatarColor(
              userInfo.userName + ',' + userInfo.userId
            )}`"
            >{{ userInfo.userName.substring(0, 1) }}</el-avatar
          >
          <div class="user-profile-info">
            <div class="user-profile-name">{{ userInfo.userName }}</div>
            <div class="user-profile-id">ID: {{ userInfo.userId }}</div>
          </div>
          <div class="user-profile__actions">
            <el-icon v-if="isSelf" :size="32" @click="editProfile"
              ><edit
            /></el-icon>
            <template v-else>
              <template v-if="!userInfo.friend">
                <el-icon :size="32" @click="addFriend"><CirclePlus /></el-icon>
              </template>
              <template v-else>
                <el-icon :size="30" @click="delFriend" color="#F56C6C"
                  ><Delete
                /></el-icon>
                <el-icon
                  v-if="userInfo.blacked"
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
          <span>Username</span>{{ userInfo.userName }}
        </div>
        <!-- <div v-if="isSelf" class="user-profile__attr">
          <span>Password</span>{{ userInfo.password }}
        </div> -->
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
        <!-- <div class="edit-profile__attr">
          <span>Password</span>
          <el-input size="large" v-model="userInfoInput.password"></el-input>
        </div> -->
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
import { generateAvatarColor } from '@/utils/avatar';
import {
  reqApplyFriend,
  reqBlackenFriend,
  reqDeleteFriend,
  reqEditUserInfo,
  reqGetUserInfo,
  reqUnblackenFriend
} from '@/api/friend';

// 获取路由参数
const route = useRoute();
const userId = parseInt(route.params.id as string);

// 判断当前查看的用户是否是自己
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);
const isSelf = computed(() => store.state.userInfo.userId === userId);

// 用户信息
let userInfo = ref({
  userId: 0,
  userName: '',
  password: '',
  email: '',
  phone: '',
  gender: 0,
  age: 0,
  friend: false,
  blacked: false
} as UserInfo);
// 获取
reqGetUserInfo(userId, uid.value).then((res) => {
  if (res.code === 0) {
    userInfo.value = res.data;
    userInfoInput.value = res.data;
  }
});

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
const editProfile = () => {
  editShow.value = true;
};
// 编辑资料弹窗
const editShow = ref(false);
let userInfoInput = ref(Object.assign({}, userInfo.value));
// 被迫自定义愚蠢的下拉框
const selectGender = (newVal: string) => {
  if (newVal === 'Man') {
    userInfoInput.value.gender = 0;
  } else {
    userInfoInput.value.gender = 1;
  }
  console.log(userInfoInput);
};
// 提交资料编辑
const submitEditProfile = () => {
  reqEditUserInfo({
    userId: '' + userId,
    userName: userInfoInput.value.userName,
    email: userInfoInput.value.email,
    phone: userInfoInput.value.phone,
    age: userInfoInput.value.age,
    gender: userInfoInput.value.gender
  }).then((res) => {
    if (res.code === 0) {
      ElMessage.success('profile changed');
    }
    editShow.value = false;
  });
};
// 添加好友
const addFriend = () => {
  ElMessageBox.prompt('Input friend request reason', 'Friend Request').then(
    (data) => {
      if (data.value.length > 0) {
        reqApplyFriend({
          userId: uid.value,
          friendId: userId,
          msg: data.value
        }).then((res) => {
          if (res.code === 0) {
            ElMessage.success('successfully send friend request');
          }
        });
      }
    }
  );
};
// 删除好友
const delFriend = () => {
  ElMessageBox.confirm(
    `Are you sure to delete your friend ${userInfo.value.userName}?`,
    'Delete Friend'
  ).then(() => {
    reqDeleteFriend({
      userId: uid.value,
      friendId: userId
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('friend deleted');
      }
    });
  });
};
// 拉黑/释放
const blackenFriend = () => {
  ElMessageBox.confirm(
    `Are you sure to send your friend ${userInfo.value.userName} to black list?`,
    'Blacken Friend'
  ).then(() => {
    reqBlackenFriend({
      userId: uid.value,
      friendId: userId
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('friend blackend');
      }
    });
  });
};
const unblackenFriend = () => {
  ElMessageBox.confirm(
    `Are you sure to release your friend ${userInfo.value.userName} from black list?`,
    'Unblacken Friend'
  ).then(() => {
    reqUnblackenFriend({
      userId: uid.value,
      friendId: userId
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('friend unblackend');
      }
    });
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
