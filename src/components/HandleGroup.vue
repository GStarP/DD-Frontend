<template>
  <div class="handle-group">
    <div class="handle-group__result">
      <el-scrollbar v-if="groupRequests.length > 0">
        <div
          v-for="g in groupRequests"
          :key="'handle' + 'g' + g.groupRequestId"
          class="group-request"
        >
          <el-avatar
            class="group-request__avatar"
            :style="`font-size: 24px;background-color: ${generateAvatarColor(
              g.user.userName + ',' + g.user.userId
            )}`"
            >{{ g.user.userName.substring(0, 1) }}</el-avatar
          >
          <div class="group-request__main">
            <div class="group-request__info">
              <div class="group-request__user">{{ g.user.userName }}</div>
              <span>want to join</span>
              <div class="group-request__group">{{ g.group.groupName }}</div>
            </div>
            <div class="group-request__desc">{{ g.reason }}</div>
          </div>
          <div class="group-request__action">
            <el-button
              circle
              :icon="Select"
              type="success"
              @click="accept(g.groupRequestId)"
            ></el-button>
            <el-button
              circle
              :icon="CloseBold"
              type="danger"
              @click="refuse(g.groupRequestId)"
            ></el-button>
          </div>
        </div>
      </el-scrollbar>
      <div class="handle-group-none" v-else>No Request</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';
import { reqHandleGroupRequest, reqListGroupRequest } from '@/api/group';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { GroupRequestHandleType } from '@/api/group';

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

// 查看加群请求
const groupRequests = ref([] as GroupRequest[]);
const fetchGroupRequests = () => {
  reqListGroupRequest(uid.value).then((res) => {
    if (res.code === 0) {
      groupRequests.value = res.data;
    }
  });
};
fetchGroupRequests();

// 接收请求
const accept = (rid: number) => {
  ElMessageBox.confirm(
    'Are you sure to ACCEPT this group request?',
    'Confirm'
  ).then(() => {
    reqHandleGroupRequest({
      userId: uid.value,
      groupRequestId: rid,
      type: GroupRequestHandleType.ACCEPT
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('request accepted');
        fetchGroupRequests();
      }
    });
  });
};
// 拒绝请求
const refuse = (rid: number) => {
  ElMessageBox.confirm(
    'Are you sure to REFUSE this group request?',
    'Confirm'
  ).then(() => {
    reqHandleGroupRequest({
      userId: uid.value,
      groupRequestId: rid,
      type: GroupRequestHandleType.REFUSE
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success('request refused');
        fetchGroupRequests();
      }
    });
  });
};
</script>

<style lang="scss">
.handle-group {
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
    .group-request {
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
      &__info {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 32px;
        span {
          margin: 0 12px;
          font-size: 14px;
          font-weight: 300;
        }
      }
      &__user {
        font-size: 18px;
      }
      &__group {
        font-size: 16px;
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

  .handle-group-none {
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
