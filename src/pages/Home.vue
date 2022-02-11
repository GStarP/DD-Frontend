<template>
  <div class="home">
    <div class="home__side">
      <div class="status-header">
        <el-avatar
          :size="32"
          :style="`font-size: 16px;background-color: ${generateAvatarColor(
            userInfo.userName + ',' + userInfo.userId
          )}`"
          >{{ userInfo.userName.substring(0, 1) }}</el-avatar
        >
        <div class="status-header__name" @click="toMyProfile">
          {{ userInfo.userName }}
        </div>
        <el-tag
          class="status-header__online"
          :type="online ? 'success' : 'danger'"
          size="small"
          effect="dark"
          @click="reqReconnect()"
          >{{ online ? 'online' : 'offline' }}</el-tag
        >
        <el-image
          class="status-header__zone"
          :src="zoneImg"
          @click="toZone"
        ></el-image>
      </div>
      <div class="side-list">
        <el-tabs
          type="card"
          tab-position="bottom"
          :stretch="true"
          v-model="sideMode"
        >
          <el-tab-pane :name="SideMode.Frd">
            <template #label><div>FRIEND</div></template>
            <list-friend />
          </el-tab-pane>
          <el-tab-pane :name="SideMode.Grp">
            <template #label><div>GROUP</div></template>
            <list-group />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="home__main">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import zoneImg from '@/assets/zone.png';
import ListFriend from '@/components/ListFriend.vue';
import router from '@/plugins/router';
import { generateAvatarColor } from '@/utils/avatar';
import ListGroup from '@/components/ListGroup.vue';
import { useStore } from 'vuex';
import { initIM, reconnect } from '@/plugins/im';

const store = useStore();

/**
 * 侧边栏顶部状态条
 */
// 个人信息
const userInfo = computed(() => store.state.userInfo as UserInfo);
const toMyProfile = () => {
  router.push({
    path: `/home/profile/f/${userInfo.value.userId}`
  });
};
// WS 在线状态
const online = computed(() => store.state.online as boolean);
const reqReconnect = () => {
  if (!online.value) {
    reconnect(userInfo.value.userId);
  }
};
initIM(userInfo.value.userId);
// 去空间
const toZone = () => {
  router.push({
    path: '/home/zone'
  });
};

/**
 * 侧边栏底部 Tab
 */
// 列表类型：好友；群组
enum SideMode {
  Frd = 'FRD',
  Grp = 'GRD'
}
const sideMode = ref(SideMode.Frd);
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  $side-w: 25%;
  &__side {
    width: $side-w;
    min-width: 360px;
    height: 100%;
    box-sizing: border-box;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 2;
    .status-header {
      width: 100%;
      height: 64px;
      box-sizing: border-box;
      border-right: 1px #409eff solid;
      padding: 0 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #409eff;
      color: #fff;
      .el-avatar--circle {
        border: 2px #fff solid;
      }
      &__name {
        margin-left: 12px;
        font-size: 16px;
        &:hover {
          cursor: pointer;
        }
      }
      &__online {
        margin-left: 8px;
        &:hover {
          cursor: pointer;
        }
      }
      &__zone {
        margin-left: auto;
        $zone-icon-size: 32px;
        width: $zone-icon-size;
        height: $zone-icon-size;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 50%;
        border: 2px #fff solid;
        &:hover {
          cursor: pointer;
          opacity: 0.9;
        }
      }
    }
    .side-list {
      flex: 1;
      // 自定义 el-tab 样式
      .el-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        &__content {
          flex: 1;
        }
      }
      .el-tabs--bottom .el-tabs__header.is-bottom {
        margin-top: 0;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border-radius: 0;
        border-right: none;
      }
      .el-tabs__content > div {
        height: 100%;
      }
    }
  }
  &__main {
    width: 100% - $side-w;
    height: 100%;
  }
}
</style>
