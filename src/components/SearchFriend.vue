<template>
  <div class="search-friend">
    <el-input
      class="search-friend__input"
      size="large"
      :prefix-icon="Search"
      placeholder="input user id or user name"
      v-model="searchInput"
      @keyup.enter="searchFriend"
    ></el-input>
    <div class="search-friend__result">
      <el-scrollbar v-if="searchRes.length > 0">
        <div
          v-for="u in searchRes"
          :key="'search' + u.userId"
          class="user-brief"
        >
          <el-avatar
            class="user-brief__avatar"
            :style="`font-size: 24px;background-color: ${generateAvatarColor(
              u.userName + ',' + u.userId
            )}`"
            >{{ u.userName.substring(0, 1) }}</el-avatar
          >
          <div class="user-brief__main">
            <div class="user-brief__name" @click="toUserProfile(u.userId)">
              {{ u.userName }}
            </div>
            <div class="user-brief__id">ID: {{ u.userId }}</div>
          </div>
          <div class="user-brief__action">
            <el-button
              v-if="!u.friend"
              type="primary"
              size="large"
              round
              @click="sendFriendReq(u.userId)"
              >Add Friend</el-button
            >
          </div>
        </div>
      </el-scrollbar>
      <div class="search-friend-none" v-else>No Result</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';
import {
  reqApplyFriend,
  reqSearchUserById,
  reqSearchUserByName
} from '@/api/friend';
import { useStore } from 'vuex';
import router from '@/plugins/router';
import { isNumber } from '@/utils/common';

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

// Input
const searchInput = ref('');
const searchFriend = () => {
  if (searchInput.value.length < 1) {
    ElMessage.error('search key cannot be empty');
  } else {
    const key = searchInput.value;
    if (isNumber(key)) {
      reqSearchUserById(key, uid.value).then((res) => {
        if (res.code === 0) {
          searchRes.value = [res.data];
        }
      });
    } else {
      reqSearchUserByName(key, uid.value).then((res) => {
        if (res.code === 0) {
          searchRes.value = res.data;
        }
      });
    }
  }
};

// 搜索结果
const searchRes = ref([] as UserInfo[]);

// 查看用户资料
const toUserProfile = (userId: number) => {
  router.push({
    path: `/home/profile/f/${userId}`
  });
};

// 发送好友请求
const sendFriendReq = (friendId: number) => {
  ElMessageBox.prompt('Input friend request reason', 'Friend Request').then(
    (data) => {
      if (!data.value) data.value = 'hello';
      if (data.value.length > 0) {
        reqApplyFriend({
          userId: uid.value,
          friendId,
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
</script>

<style lang="scss">
.search-friend {
  width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 36px;
  position: relative;
  &__input {
    .el-input__prefix {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  &__result {
    flex: 1;
    position: relative;
    margin-top: 16px;
    .el-scrollbar {
      position: absolute;
      width: 100%;
      height: 100%;
      .el-scrollbar__bar.is-vertical {
        width: 0;
      }
    }
    .user-brief {
      box-sizing: border-box;
      padding: 12px 0px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 4px;
      &__main {
        margin-left: 12px;
        height: 56px;
      }
      &__name {
        height: 32px;
        font-size: 18px;
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
      &__id {
        font-size: 14px;
        color: #909399;
      }
      &__action {
        margin-left: auto;
      }
    }
    .search-friend-none {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 35%;
      font-size: 36px;
      font-weight: 300;
      color: #dcdfe6;
      user-select: none;
    }
  }
}
</style>
