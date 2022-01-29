<template>
  <div class="profile-group">
    <div class="profile-group__header">
      <el-icon class="profile-group-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="profile-group-title">
        Group Profile
      </div>
      <span style="width: 32px; height: 1px;"></span>
    </div>
    <div class="profile-group__main">
      <div class="group-profile">
        <div class="group-profile__main">
          <el-avatar class="group-profile-avatar"></el-avatar>
          <div class="group-profile-info">
            <div class="group-profile-name">{{ groupInfo.groupName }}</div>
            <div class="group-profile-id">ID: {{ groupInfo.groupId }}</div>
          </div>
          <div class="group-profile__actions">
            <el-button type="danger" @click="quitGroup">{{
              isGroupMaster ? 'DISSOLVE' : 'QUIT'
            }}</el-button>
          </div>
        </div>
      </div>
      <div class="group-members-hint">Members</div>
      <div class="group-members">
        <el-scrollbar class="group-members-list">
          <div
            class="group-members-item"
            v-for="(m, index) in groupInfo.members"
            :key="'group' + groupInfo.groupId + 'user' + m.userId"
          >
            <el-avatar
              class="group-members-item__avatar"
              :src="m.userAvatar"
            ></el-avatar>
            <div class="group-members-item__main">
              <div class="group-members-item__name">
                <div>{{ m.userName }}</div>
                <el-tag v-if="index === 0">Master</el-tag>
              </div>
              <div class="group-members-item__id">ID: {{ m.userId }}</div>
            </div>
            <div class="group-members-item__action">
              <el-button
                v-if="isGroupMaster && uid !== m.userId"
                @click="kick(m)"
                >Kick</el-button
              >
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/plugins/router';
import { useRoute } from 'vue-router';
import { ArrowLeft, CircleClose } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
// 获取路由参数
const route = useRoute();
const groupId = parseInt(route.params.id as string);
// 获取群组信息
let groupInfo: GroupInfo;
// mock
groupInfo = {
  groupId: 0,
  groupName: 'SCRUM 2020',
  members: []
} as GroupInfo;
for (let i = 0; i < 10; i++) {
  groupInfo.members.push({
    userId: i,
    userName: 'Gangshan Wu',
    userAvatar: ''
  });
}
// 判断用户是否为当前群群主
const store = useStore();
const uid = computed(() => store.state.uid as number);
const isGroupMaster = computed(
  () => store.state.uid === groupInfo.members[0].userId
);
/**
 * 顶部栏
 */
const back = () => {
  router.back();
};
/**
 * 群组信息
 */
// 解散/退出群组
const quitGroup = () => {
  if (isGroupMaster.value) {
    ElMessageBox.confirm(
      `Are you sure to dissolve group ${groupInfo.groupName}?`,
      'Dissolve Group'
    ).then(() => {
      ElMessage.info('dissolved');
    });
  } else {
    ElMessageBox.confirm(
      `Are you sure to quit group ${groupInfo.groupName}?`,
      'Dissolve Group'
    ).then(() => {
      ElMessage.info('quited');
    });
  }
};
// 踢出用户
const kick = (u: UserBrief) => {
  ElMessageBox.confirm(
    `Are you sure to kick ${u.userName}?`,
    'Kick Member'
  ).then(() => {
    ElMessage.info('kicked');
  });
};
</script>

<style lang="scss">
.profile-group {
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
    transition: color 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  &-title {
    font-size: 20px;
  }
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 36px 0;
  }
  .group-profile {
    width: 400px;
    display: flex;
    flex-direction: column;
    &__main {
      display: flex;
      flex-direction: row;
      margin-bottom: 16px;
    }
    &-info {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
    }
    &-name {
      font-size: 20px;
      height: 32px;
    }
    &-id {
      font-size: 15px;
    }
    &__actions {
      margin-left: auto;
      display: flex;
      flex-direction: row;
      > i {
        transition: color 0.3s;
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
      > i:not(:first-child) {
        margin-left: 16px;
      }
    }
  }
  .group-members-hint {
    font-weight: 300;
    width: 600px;
    box-sizing: border-box;
    padding-left: 8px;
    border-left: 6px #000 solid;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .group-members {
    flex: 1;
    width: 600px;
    position: relative;
    .el-scrollbar__bar.is-vertical {
      width: 0;
    }
    &-list {
      position: absolute;
      width: 100%;
    }
    &-item {
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
        display: flex;
        flex-direction: row;
        > div {
          font-size: 18px;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
        .el-tag {
          margin-left: 10px;
          margin-top: 1px;
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
  }
}
</style>
