<template>
  <div class="list-friend">
    <div class="new-friend" @click="toNewFriend">
      <el-icon><plus /></el-icon>
      <div>New Friend</div>
    </div>
    <div class="friend-list-container">
      <el-scrollbar class="friend-list">
        <div
          class="friend-item"
          :class="{ 'friend-item-active': frd.friendId == 1 }"
          v-for="frd in friendList"
          :key="'frd' + frd.friendId"
          @click="toFriendDialog(frd.friendId)"
        >
          <el-avatar
            class="friend-item__avatar"
            :size="44"
            :src="frd.avatar"
          ></el-avatar>
          <div class="friend-item__main">
            <div class="friend-item__top">
              <div class="friend-item__name">{{ frd.name }}</div>
              <div class="friend-item__recent-time">{{ frd.recentTime }}</div>
            </div>
            <div class="friend-item__recent-text">{{ frd.recentText }}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/plugins/router';
import { Plus } from '@element-plus/icons-vue';
/**
 * 查找好友，处理好友申请的入口
 */
const toNewFriend = () =>
  router.push({
    path: '/home/new-friend'
  });

/**
 * 好友列表
 */
const friendList: FriendBrief[] = [];
// mock
for (let i = 0; i < 15; i++) {
  friendList.push({
    friendId: i,
    avatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    name: 'Feng Liu',
    recentText: 'did any students handle their homework?',
    recentTime: 'Today 13:45'
  });
}
const toFriendDialog = (uid: number) => {
  router.push({
    path: `/home/dialog/f/${uid}`
  });
};
</script>

<style lang="scss">
.list-friend {
  height: 100%;
  display: flex;
  flex-direction: column;
  .new-friend {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    background-color: #ebeef5;
    transition: background-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-size: 14px;
    color: #606266;
    > div {
      margin-left: 8px;
      font-weight: 300;
      user-select: none;
    }
    &:hover {
      cursor: pointer;
      background-color: #dcdfe6;
    }
  }
  .friend-list-container {
    flex: 1;
    position: relative;
  }
  .friend-list {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .friend-item {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 72px;
    box-sizing: border-box;
    padding: 14px 16px;
    transition: background-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    &:hover {
      cursor: pointer;
      background-color: #ebeef5;
    }
    &-active {
      background-color: #dcdfe6;
    }
    &__main {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }
    &__top {
      display: flex;
      flex-direction: row;
      height: 24px;
    }
    &__name {
      font-size: 16px;
    }
    &__recent-text {
      font-size: 13px;
      color: #909399;
      height: 44px - 24px;

      width: 360px - 16px * 2 - 44px - 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }
    &__recent-time {
      margin-left: auto;
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
