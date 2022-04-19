<template>
  <div class="list-group">
    <div class="new-group" @click="toNewGroup">
      <el-icon><plus /></el-icon>
      <div>New Group</div>
      <el-icon
        :size="18"
        class="list-group-refresh"
        @click.stop="fetchGroupList"
        ><refresh
      /></el-icon>
    </div>
    <div class="group-list-container">
      <el-scrollbar class="group-list">
        <div
          class="group-item"
          :class="{ 'group-item-active': grp.groupId == curGroup }"
          v-for="(grp, index) in groupList"
          :key="'grp' + grp.groupId"
          @click="toGroupDialog(grp.groupId, grp.groupName, index)"
        >
          <el-avatar
            class="group-item__avatar"
            :size="44"
            :style="`font-size: 20px;background-color: ${generateAvatarColor(
              grp.groupName
            )}`"
            >{{ grp.groupName.substring(0, 1) }}</el-avatar
          >
          <div class="group-item__main">
            <div class="group-item__top">
              <div class="group-item__name">{{ grp.groupName }}</div>
              <div class="group-item__recent-time">{{ grp.msgTime }}</div>
            </div>
            <div class="group-item__bottom">
              <div class="group-item__recent-text">{{ grp.msg }}</div>
              <div
                :style="{ visibility: grp.msgNum < 1 ? 'hidden' : 'visible' }"
                class="group-item__recent-num"
              >
                {{ grp.msgNum }}
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
import { computed, ref } from 'vue';
import { reqListGroup } from '@/api/group';
import { useStore } from 'vuex';

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

/**
 * 查找好友，处理好友申请的入口
 */
const toNewGroup = () =>
  router.push({
    path: '/home/new-group'
  });

/**
 * 群组列表
 */
const groupList = computed<GroupBriefWithMsg[]>(() => store.state.groupList);
// 获取全部群组
const fetchGroupList = () => {
  reqListGroup(uid.value).then((res) => {
    if (res.code === 0) {
      store.commit(
        'groupList',
        res.data.map((gb) => {
          return {
            ...gb,
            msg: 'no new message',
            msgTime: '',
            msgNum: 0
          } as GroupBriefWithMsg;
        })
      );
      curGroup.value = -1;
    }
  });
};
fetchGroupList();

// 查看对话
const curGroup = ref(-1);
const toGroupDialog = (gid: number, gname: string, index: number) => {
  // 查看对话时清零所有未读消息数
  store.commit('clearUnread', {
    type: 'g',
    index
  });
  curGroup.value = gid;
  // 更新当前对话
  store.commit('curDialog', `g${gid}`);
  router.push({
    path: `/home/dialog/g/${gid}/${gname}`
  });
};
</script>

<style lang="scss">
.list-group {
  height: 100%;
  display: flex;
  flex-direction: column;
  .new-group {
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
  .group-list-container {
    flex: 1;
    position: relative;
  }
  .group-list {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .group-item {
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
    &__recent-text {
      flex: 1;
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
    &__bottom {
      display: flex;
      flex-direction: row;
      flex: 1;
    }
    &__recent-text {
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
