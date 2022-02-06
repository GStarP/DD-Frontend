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
          :class="{ 'friend-item-active': frd.userId === curFriend }"
          v-for="frd in friendList"
          :key="'frd' + frd.userId"
          @click="toFriendDialog(frd.userId)"
        >
          <el-avatar
            class="friend-item__avatar"
            :size="44"
            :style="`font-size: 20px;background-color: ${generateAvatarColor(
              frd.userName
            )}`"
            >{{ frd.userName.substring(0, 1) }}</el-avatar
          >
          <div class="friend-item__main">
            <div class="friend-item__top">
              <div class="friend-item__name">{{ frd.userName }}</div>
              <div class="friend-item__recent-time"></div>
            </div>
            <div class="friend-item__recent-text">no new message</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/plugins/router';
import { Plus } from '@element-plus/icons-vue';
import { generateAvatarColor } from '@/utils/avatar';
import { reqListFriend } from '@/api/friend';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

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
const friendList = ref([] as UserInfo[]);
// 获取全部好友
reqListFriend(uid.value).then((res) => {
  if (res.code === 0) {
    friendList.value = res.data;
    curFriend.value = friendList.value[0].userId;
  }
});
// 查看对话
const curFriend = ref(-1);
const toFriendDialog = (uid: number) => {
  curFriend.value = uid;
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
