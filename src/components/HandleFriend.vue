<template>
  <div class="handle-friend">
    <div class="handle-friend__result">
      <el-scrollbar v-if="friendRequests.length > 0">
        <div
          v-for="f in friendRequests"
          :key="'handle' + f.requestId"
          class="friend-request"
        >
          <el-avatar
            class="friend-request__avatar"
            :src="f.userAvatar"
          ></el-avatar>
          <div class="friend-request__main">
            <div class="friend-request__name">{{ f.userName }}</div>
            <div class="friend-request__desc">{{ f.description }}</div>
          </div>
          <div class="friend-request__action">
            <el-button
              circle
              :icon="Select"
              type="success"
              @click="accept(f.requestId)"
            ></el-button>
            <el-button
              circle
              :icon="CloseBold"
              type="danger"
              @click="refuse(f.requestId)"
            ></el-button>
          </div>
        </div>
      </el-scrollbar>
      <div class="search-friend-none" v-else>
        No Result
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 好友请求
const friendRequests: FriendRequest[] = [];
// mock
for (let i = 0; i < 10; i++) {
  friendRequests.push({
    requestId: i,
    userId: i,
    userName: 'Yan Zhang',
    userAvatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    description: 'pls check your lessons for me'
  });
}

const accept = (rid: number) => {
  ElMessageBox.confirm(
    'Are you sure to ACCEPT this friend request?',
    'Confirm'
  ).then(() => {
    ElMessage.info('accepted');
  });
};
const refuse = (rid: number) => {
  ElMessageBox.confirm(
    'Are you sure to REFUSE this friend request?',
    'Confirm'
  ).then(() => {
    ElMessage.info('refused');
  });
};
</script>

<style lang="scss">
.handle-friend {
  display: flex;
  flex-direction: column;
  width: 600px;
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
    .friend-request {
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
      }
      &__desc {
        font-size: 14px;
        color: #909399;
      }
      &__action {
        margin-left: auto;
      }
    }
  }
}
</style>
