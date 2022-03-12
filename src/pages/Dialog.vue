<template>
  <div class="dialog">
    <div class="dialog__header">
      <el-icon class="dialog-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="dialog-title">
        {{ name }}
      </div>
      <el-icon
        :style="{
          visibility: id === 9999 ? 'hidden' : ''
        }"
        class="dialog-profile"
        :size="32"
        @click="toProfile"
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
            :key="`s${m.sender}r${m.receiver}t${m.timestamp}`"
          >
            <el-avatar
              class="message-avatar"
              :size="48"
              :style="`font-size: 20px;background-color: ${generateAvatarColor(
                usn(m.sender) + ',' + m.sender
              )}`"
              >{{ usn(m.sender).substring(0, 1) }}</el-avatar
            >
            <div class="message__main">
              <div class="message-sender">{{ usn(m.sender) }}</div>
              <div class="triangle"></div>
              <div class="message-content">
                <div>{{ m.payload }}</div>
              </div>
            </div>

            <div class="message-time">
              {{ formatTimestamp(m.timestamp) }}
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="dialog__toolbar">
      <el-icon :size="28" @click="sendImage"><picture-filled /></el-icon>
      <el-icon :size="28" @click="sendEmoji"><eleme /></el-icon>
    </div>
    <div class="dialog__input">
      <el-input
        :model-value="textInput"
        type="textarea"
        :rows="7"
        @input="filterEnter($event)"
        @keyup.enter="confirmSendText"
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
import { usn } from '@/utils/cache';
import { sendMessage } from '@/plugins/im';
import { formatTimestamp } from '@/utils/time';

// 获取路由参数
const route = useRoute();
const type = computed(() => route.params.type as string);
const id = computed(() => parseInt(route.params.id as string));
const name = computed(() => route.params.name as string);

// uid
const store = useStore();
const uid = computed(() => store.state.userInfo.userId as number);

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
    path: `/home/profile/${type.value}/${id.value}`
  });
};

/**
 * 聊天框
 */
const messages = computed<Message[]>(
  () => store.state.dialogs[`${type.value}${id.value}`] || []
);

/**
 * 输入框
 */
// 发送图片
const sendImage = () => {
  ElMessage.info('to be continued');
};
// 发送表情
const sendEmoji = () => {
  ElMessage.info('to be continued');
};
// 发送文字
let textInput = ref('');
// 暂不允许输入回车, 按下 Enter 键立即发送消息
const filterEnter = (newVal: string) => {
  if (newVal.endsWith('\n')) {
    // nothing happen
  } else {
    textInput.value = newVal;
  }
};
const confirmSendText = () => {
  if (textInput.value.length > 0) {
    const message: Message = {
      sender: uid.value,
      receiver: id.value,
      group: type.value === 'g' ? 1 : 0,
      type: 'text',
      timestamp: new Date().getTime(),
      payload: textInput.value
    };
    // TODO 目前自己发送的消息直接渲染上去
    store.commit('recvMessage', {
      k: `${type.value}${id.value}`,
      message
    });
    sendMessage(message);
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
      margin-top: 16px;
      position: relative;
      &:first-child {
        margin-top: 24px;
      }
      &:last-child {
        margin-bottom: 24px;
      }
      &__main {
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-left: 12px;
      }
      &-sender {
        font-size: 13px;
        margin-bottom: 2px;
        color: #303133;
      }
      &-content {
        width: fit-content;
        box-sizing: border-box;
        padding: 10px 14px;
        background-color: #dcdfe6;
        border-radius: 8px;
        z-index: 2;
      }
      &-time {
        position: absolute;
        top: 50px;
        width: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 300;
        color: #909399;
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
        .message-content {
          align-self: end;
        }
        .message-time {
          left: auto;
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
