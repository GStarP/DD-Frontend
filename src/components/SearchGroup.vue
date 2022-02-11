<template>
  <div class="search-group">
    <el-input
      class="search-group__input"
      size="large"
      :prefix-icon="Search"
      placeholder="input group id"
      v-model="searchKeyInput"
      @keyup.enter="searchGroup"
    ></el-input>
    <div class="search-group__result">
      <el-scrollbar v-if="searchRes.length > 0">
        <div
          v-for="g in searchRes"
          :key="'search' + 'g' + g.groupId"
          class="group-brief"
        >
          <el-avatar
            class="group-brief__avatar"
            :style="`font-size: 24px;background-color: ${generateAvatarColor(
              g.groupName
            )}`"
            >{{ g.groupName.substring(0, 1) }}</el-avatar
          >
          <div class="group-brief__main">
            <div class="group-brief__name" @click="toGroupProfile(g.groupId)">
              {{ g.groupName }}
            </div>
            <div class="group-brief__id">Group ID: {{ g.groupId }}</div>
          </div>
          <div class="group-brief__action">
            <el-button
              v-if="!g.in"
              type="primary"
              size="large"
              round
              @click="joinGroup(g.groupId)"
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
import { computed, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';
import { reqJoinGroup, reqSearchGroup } from '@/api/group';
import router from '@/plugins/router';
import { useStore } from 'vuex';

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

// Input
const searchKeyInput = ref('');
const searchGroup = () => {
  if (searchKeyInput.value.length < 1) {
    ElMessage.error('search key cannot be empty');
  } else {
    reqSearchGroup({
      userId: uid.value,
      searchKey: searchKeyInput.value
    }).then((res) => {
      if (res.code === 0) {
        searchRes.value = res.data;
      }
    });
  }
};

// 搜索结果
const searchRes = ref([] as GroupSearchBrief[]);
const toGroupProfile = (groupId: number) => {
  router.push({
    path: `/home/profile/g/${groupId}`
  });
};

// 加群
const joinGroup = (groupId: number) => {
  ElMessageBox.prompt('Input group request reason', 'Group Request').then(
    (data) => {
      if (data.value.length > 0) {
        reqJoinGroup({
          userId: uid.value,
          groupId,
          reason: data.value
        }).then((res) => {
          if (res.code === 0) {
            ElMessage.success('successfully send group request');
          }
        });
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
    .group-brief {
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
