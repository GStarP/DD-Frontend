<template>
  <div class="dialog">
    <div class="dialog__header">
      <el-icon class="dialog-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="dialog-title">
        {{ type === 'f' ? userBrief.userName : groupBrief.groupName }}
      </div>
      <el-icon class="dialog-profile" :size="32" @click="toProfile"
        ><UserFilled
      /></el-icon>
    </div>
    <div class="dialog__main">
      <div class="message-list">
        <el-scrollbar>
          <div
            class="message"
            :class="{
              message__self: m.sender === uid
            }"
            v-for="m in messages"
            :key="`s${m.sender}r${m.receiver}t${m.time}`"
          >
            <el-avatar
              class="message-avatar"
              :size="48"
              :style="`font-size: 20px;background-color: ${generateAvatarColor(
                userName(m.sender)
              )}`"
              >{{ userName(m.sender).substring(0, 1) }}</el-avatar
            >
            <div class="message__main">
              <div class="message-sender">{{ userName(m.sender) }}</div>
              <div class="triangle"></div>
              <div class="message-content">
                {{ m.payload }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="dialog__toolbar">
      <el-icon :size="28"><picture-filled /></el-icon>
      <el-icon :size="28"><eleme /></el-icon>
    </div>
    <div class="dialog__input">
      <el-input
        :model-value="textInput"
        type="textarea"
        :rows="7"
        @input="filterEnter($event)"
        @keyup.enter="sendText"
      ></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  ArrowLeft,
  UserFilled,
  PictureFilled,
  Eleme
} from '@element-plus/icons-vue';
import router from '@/plugins/router';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { generateAvatarColor } from '@/utils/avatar';

// 获取路由参数
const route = useRoute();
const type = route.params.type as string;
const id = parseInt(route.params.id as string);
// 获取信息
let userBrief: UserBrief;
let groupBrief: GroupBrief;
// mock
if (type === 'f') {
  userBrief = {
    userId: 0,
    userName: 'Lei Huang',
    userAvatar: ''
  } as UserBrief;
} else if (type === 'g') {
  groupBrief = {
    groupId: 0,
    groupName: 'SCRUM 2022',
    groupAvatar: ''
  } as GroupBrief;
}
/**
 * 顶部栏
 */
const back = () => {
  router.push({
    path: '/home'
  });
};
const toProfile = () => {
  router.push({
    path: `/home/profile/${type}/${id}`
  });
};
/**
 * 聊天框
 */
const messages: Message[] = [];
// mock
for (let i = 0; i < 10; i++) {
  messages.push({
    sender: i % 2,
    receiver: (i % 2) + 1,
    type: 'text',
    time: '2022-01-29 21:34',
    payload: 'What are you doing? What are you doing! What are you doing...'
  });
}
const store = useStore();
const uid = computed(() => store.state.uid as number);
// TODO 缓存用户名
const userName = (uid: number) => {
  return 'Feng Liu';
};
/**
 * 输入框
 */
let textInput = ref('');
const filterEnter = (newVal: string) => {
  if (newVal.endsWith('\n')) {
    // nothing happen
  } else {
    textInput.value = newVal;
  }
};
const sendText = () => {
  if (textInput.value.length > 0) {
    ElMessage.info(textInput.value);
    textInput.value = '';
  }
};
</script>

<style lang="scss">
.dialog {
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
  &-profile {
    transition: color 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  &__main {
    flex: 1;
  }
  .message-list {
    height: 100%;
    position: relative;
    .el-scrollbar {
      position: absolute;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0px 24px;
    }
    .message {
      display: flex;
      flex-direction: row;
      width: 100%;
      margin-top: 8px;
      position: relative;
      &:first-child {
        margin-top: 24px;
      }
      &:last-child {
        margin-bottom: 24px;
      }
      &__main {
        display: flex;
        flex-direction: column;
        margin-left: 12px;
      }
      &-sender {
        font-size: 14px;
        margin-bottom: 4px;
        color: #303133;
      }
      &-content {
        width: 30vw;
        min-width: 300px;
        box-sizing: border-box;
        padding: 8px 12px;
        background-color: #dcdfe6;
        border-radius: 8px;
        z-index: 2;
      }
      .triangle {
        width: 0;
        height: 0;
        border-top: 16px #dcdfe6 solid;
        border-bottom: 16px transparent solid;
        border-left: 16px transparent solid;
        border-right: 16px transparent solid;
        position: absolute;
        left: 50px;
        top: 26px;
        z-index: 1;
      }

      &__self {
        flex-direction: row-reverse;
        .message__main {
          margin-right: 12px;
        }
        .message-sender {
          text-align: right;
        }
        .triangle {
          right: 50px;
          left: auto;
        }
      }
    }
  }
  &__toolbar {
    height: 48px;
    box-sizing: border-box;
    border-top: 1px #dcdfe6 solid;
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
  &__input {
    height: 200px;
    .el-textarea__inner {
      border: none;
      resize: none;
      font-size: 18px;
    }
  }
}
</style>
