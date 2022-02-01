<template>
  <div class="search-group">
    <el-input
      class="search-group__input"
      size="large"
      :prefix-icon="Search"
      placeholder="input group id"
      v-model="searchInput"
      @change="searchGroup"
    ></el-input>
    <div class="search-group__result">
      <el-scrollbar v-if="searchRes.length > 0">
        <div
          v-for="g in searchRes"
          :key="'search' + g.groupId"
          class="user-brief"
        >
          <el-avatar
            class="user-brief__avatar"
            :style="`font-size: 24px;background-color: ${generateAvatarColor(
              g.groupName
            )}`"
            >{{ g.groupName.substring(0, 1) }}</el-avatar
          >
          <div class="user-brief__main">
            <div class="user-brief__name">{{ g.groupName }}</div>
            <div class="user-brief__id">Group ID: {{ g.groupId }}</div>
          </div>
          <div class="user-brief__action">
            <el-button
              type="primary"
              size="large"
              round
              @click="sendGroupReq(g.groupId)"
              >Join Group</el-button
            >
          </div>
        </div>
      </el-scrollbar>
      <div class="search-group-none" v-else>
        No Result
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';

// Input
const searchInput = ref('');
const searchGroup = () => {
  if (searchInput.value.length < 1) {
    ElMessage.error('search key cannot be empty');
  } else {
    // TODO
    ElMessage.info(searchInput.value);
  }
};
// 搜索结果
const searchRes: GroupBrief[] = [];
// mock
for (let i = 0; i < 10; i++) {
  searchRes.push({
    groupId: i,
    groupName: 'SCRUM 2022'
  });
}
// 发送好友请求
const sendGroupReq = (groupId: number) => {
  ElMessageBox.prompt('Input group request reason', 'Group Request').then(
    (data) => {
      if (data.value.length > 0) {
        ElMessage.info(data.value);
      }
    }
  );
};
</script>

<style lang="scss">
.search-group {
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
    .search-group-none {
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
