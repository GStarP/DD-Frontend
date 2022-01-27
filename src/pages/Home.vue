<template>
  <div class="home">
    <div class="home__side">
      <div class="status-header">
        <el-avatar :size="32" :src="avatarImg"></el-avatar>
        <div class="status-header__name">{{ nickname }}</div>
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
            <div>GROUP</div>
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
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import zoneImg from '@/assets/zone.png';
import ListFriend from '@/components/ListFriend.vue';

/**
 * 侧边栏顶部状态条
 */
const avatarImg =
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
const nickname = 'Dong Shao';
const toZone = () => {
  ElMessage.info('to zone');
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
