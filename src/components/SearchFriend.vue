<template>
  <div class="search-friend">
    <el-input
      class="search-friend__input"
      size="large"
      :prefix-icon="Search"
      placeholder="input user id"
      v-model="searchInput"
      @change="searchFriend"
    ></el-input>
    <div class="search-friend__result">
      <el-scrollbar v-if="searchRes.length > 0">
        <div
          v-for="u in searchRes"
          :key="'search' + u.userId"
          class="user-brief"
        >
          <el-avatar class="user-brief__avatar" :src="u.userAvatar"></el-avatar>
          <div class="user-brief__main">
            <div class="user-brief__name">{{ u.userName }}</div>
            <div class="user-brief__id">ID: {{ u.userId }}</div>
          </div>
          <div class="user-brief__action">
            <el-button
              type="primary"
              size="large"
              round
              @click="sendFriendReq(u.userId)"
              >Add Friend</el-button
            >
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
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// Input
const searchInput = ref('');
const searchFriend = () => {
  if (searchInput.value.length < 1) {
    ElMessage.error('search key cannot be empty');
  } else {
    // TODO
    ElMessage.info(searchInput.value);
  }
};
// 搜索结果
const searchRes: UserBrief[] = [];
// mock
for (let i = 0; i < 10; i++) {
  searchRes.push({
    userId: i,
    userName: 'Zhenyu Chen',
    userAvatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  });
}
// 发送好友请求
const sendFriendReq = (userId: number) => {
  ElMessageBox.prompt('Input friend request reason', 'Friend Request').then(
    (data) => {
      if (data.value.length > 0) {
        ElMessage.info(data.value);
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
    }
  }
}
</style>
