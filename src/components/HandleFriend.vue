<template>
  <div class="handle-friend">
    <div class="handle-friend__result">
      <el-scrollbar v-if="friendRequests.length > 0">
        <div
          v-for="f in friendRequests"
          :key="f.userId + 'frdreq' + uid"
          class="friend-request"
        >
          <el-avatar
            class="friend-request__avatar"
            :style="`font-size: 24px;background-color: ${generateAvatarColor(
              f.userName + ',' + f.userId
            )}`"
            >{{ f.userName.substring(0, 1) }}</el-avatar
          >
          <div class="friend-request__main">
            <div class="friend-request__name">{{ f.userName }}</div>
            <div class="friend-request__desc">{{ f.msg }}</div>
          </div>
          <div class="friend-request__action">
            <el-button
              circle
              :icon="Select"
              type="success"
              @click="accept(uid, f.userId, f.userName)"
            ></el-button>
            <el-button
              circle
              :icon="CloseBold"
              type="danger"
              @click="refuse(uid, f.userId)"
            ></el-button>
          </div>
        </div>
      </el-scrollbar>
      <div class="handle-friend-none" v-else>
        No Request
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';
import {
  reqAcceptFriend,
  reqListFriendApply,
  reqRefuseFriend
} from '@/api/friend';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

// uid
const store = useStore();
const uid = computed<number>(() => store.state.userInfo.userId);

// 好友请求
const friendRequests = ref<FriendRequest[]>([]);
// 查看全部好友请求
const fetchFriendRequests = () => {
  reqListFriendApply(uid.value).then((res) => {
    if (res.code === 0) {
      friendRequests.value = res.data;
    }
  });
};
fetchFriendRequests();

// 同意好友请求
const accept = (userId: number, friendId: number, friendName: string) => {
  ElMessageBox.confirm(
    'Are you sure to ACCEPT this friend request?',
    'Confirm'
  ).then(() => {
    reqAcceptFriend({
      userId,
      friendId
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('request accepted');
        fetchFriendRequests();
        // 同意请求后，立马在好友列表中加入，而申请者只有刷新才知道申请通过
        const fl: FriendBriefWithMsg[] = store.state.friendList;
        fl.push({
          userId,
          friendId,
          nickname: friendName,
          msg: 'no new message',
          msgTime: '',
          msgNum: 0
        });
        store.commit('friendList', fl);
      }
    });
  });
};
// 拒绝好友请求
const refuse = (userId: number, friendId: number) => {
  ElMessageBox.confirm(
    'Are you sure to REFUSE this friend request?',
    'Confirm'
  ).then(() => {
    reqRefuseFriend({
      userId,
      friendId
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('request refused');
        fetchFriendRequests();
      }
    });
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
  .handle-friend-none {
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
</style>
