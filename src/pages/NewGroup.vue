<template>
  <div class="new-group">
    <div class="new-group__header">
      <el-icon class="new-group-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="new-group-tab">
        <div
          :class="{ 'new-group-tab-select': curTab === 0 }"
          @click="changeTab(0)"
        >
          {{ tabs[0] }}
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="{ 'new-group-tab-select': curTab === 1 }"
          @click="changeTab(1)"
        >
          {{ tabs[1] }}
        </div>
      </div>
      <el-icon class="new-group-create" :size="32" @click="createGroup"
        ><circle-plus
      /></el-icon>
    </div>
    <div class="new-group__main">
      <template v-if="curTab === 0">
        <SearchGroup />
      </template>
      <template v-if="curTab === 1">
        <HandleGroup />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ArrowLeft, CirclePlus } from '@element-plus/icons-vue';
import router from '@/plugins/router';
import { ElMessage, ElMessageBox } from 'element-plus';
import SearchGroup from '@/components/SearchGroup.vue';
import HandleGroup from '@/components/HandleGroup.vue';
import { reqCreateGroup } from '@/api/group';
import { useStore } from 'vuex';

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

/**
 * 顶部栏
 */
// Back
const back = () => {
  router.push({
    path: '/home'
  });
};
// Tab
const tabs = ['SEARCH', 'HANDLE'];
let curTab = ref(0);
const changeTab = (v: number) => {
  if (curTab.value !== v) {
    curTab.value = v;
  }
};
// 创建群组
const createGroup = () => {
  ElMessageBox.prompt("Please input the new group's name", 'Create Group').then(
    (data) => {
      if (data.value.length > 0) {
        reqCreateGroup({
          userId: uid.value,
          groupName: data.value
        }).then((res) => {
          if (res.code === 0) {
            ElMessage.success('new group created');
            // 同意请求后，立马在好友列表中加入，而申请者只有刷新才知道申请通过
            const gl: GroupBriefWithMsg[] = store.state.groupList;
            gl.push({
              groupId: res.data,
              groupName: data.value,
              msg: 'no new message',
              msgTime: '',
              msgNum: 0
            });
            store.commit('groupList', gl);
          }
        });
      }
    }
  );
};
</script>

<style lang="scss">
.new-group {
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
    transition: color 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  &-tab {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 48px;
    > div {
      font-size: 18px;
      font-weight: 300;
      transition: transform 0.3s;
      &:hover {
        cursor: pointer;
        transform: scale(1.05);
      }
    }
    &-select {
      color: #409eff;
    }
    .el-divider--vertical {
      height: 2rem;
      margin: 0 16px;
    }
  }
  &-create {
    transition: color 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  &__main {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
