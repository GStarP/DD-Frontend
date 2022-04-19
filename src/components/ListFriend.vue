<template>
  <div class="list-friend">
    <div class="new-friend" @click="toNewFriend">
      <el-icon><plus /></el-icon>
      <div>New Friend</div>
      <el-icon
        :size="18"
        class="list-friend-refresh"
        @click.stop="fetchFriendList"
        ><refresh
      /></el-icon>
    </div>
    <div class="friend-list-container">
      <el-scrollbar class="friend-list">
        <div
          class="friend-item"
          :class="{ 'friend-item-active': frd.friendId === curFriend }"
          v-for="(frd, index) in friendList"
          :key="'frd' + frd.friendId"
          @click="toFriendDialog(frd.friendId, frd.nickname, index)"
        >
          <el-avatar
            class="friend-item__avatar"
            :size="44"
            :style="`font-size: 20px;background-color: ${generateAvatarColor(
              frd.nickname + ',' + frd.friendId
            )}`"
            >{{ frd.nickname.substring(0, 1) }}</el-avatar
          >
          <div class="friend-item__main">
            <div class="friend-item__top">
              <div class="friend-item__name">{{ frd.nickname }}</div>
              <div class="friend-item__recent-time">{{ frd.msgTime }}</div>
            </div>
            <div class="friend-item__bottom">
              <div class="friend-item__recent-text">{{ frd.msg }}</div>
              <div
                :style="{ visibility: frd.msgNum < 1 ? 'hidden' : 'visible' }"
                class="friend-item__recent-num"
              >
                {{ frd.msgNum }}
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/plugins/router';
import { Plus, Refresh } from '@element-plus/icons-vue';
import { generateAvatarColor } from '@/utils/avatar';
import { reqListFriend } from '@/api/friend';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { usnCache } from '@/utils/cache';

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
const friendList = computed(
  () => store.state.friendList as FriendBriefWithMsg[]
);
// 获取全部好友
const fetchFriendList = () => {
  reqListFriend(uid.value).then((res) => {
    if (res.code === 0) {
      store.commit(
        'friendList',
        res.data.map((fb) => {
          return {
            ...fb,
            msg: 'no new message',
            msgTime: '',
            msgNum: 0
          } as FriendBriefWithMsg;
        })
      );
      for (const f of friendList.value) {
        usnCache(f.friendId, f.nickname);
      }
      curFriend.value = -1;
    }
  });
};
fetchFriendList();

// 查看对话
const curFriend = ref(-1);
const toFriendDialog = (uid: number, userName: string, index: number) => {
  // 查看对话时清零所有未读消息数
  store.commit('clearUnread', {
    type: 'f',
    index
  });
  curFriend.value = uid;
  // 更新当前对话
  store.commit('curDialog', `f${uid}`);
  router.push({
    path: `/home/dialog/f/${uid}/${userName}`
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
  &-refresh {
    transition: transform 0.5s;
    margin-left: auto;
    background-color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #909399;
    &:hover {
      cursor: pointer;
      transform: rotate(180deg);
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
      flex: 1;
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
    &__recent-time {
      margin-left: auto;
      font-size: 12px;
      color: #909399;
    }
    &__bottom {
      display: flex;
      flex-direction: row;
      flex: 1;
    }
    &__recent-text {
      flex: 1;
      font-size: 13px;
      color: #909399;
      height: 44px - 24px;

      width: 360px - 16px * 2 - 44px - 12px - 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }
    &__recent-num {
      width: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      border-radius: 4px;
      background-color: #f56c6c;
      color: #fff;
    }
  }
}
</style>
