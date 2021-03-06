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
        <el-scrollbar ref="dialogScroll">
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
                <div v-if="m.type === 'text'">{{ m.payload }}</div>
                <img
                  v-if="m.type === 'image'"
                  :src="m.payload"
                  title="double click to view"
                  @dblclick="openImage(m.payload)"
                />
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
      <el-icon :size="28" @click="sendImage">
        <input
          id="sendImageUpload"
          type="file"
          accept="image/png, image/jpeg"
          @change="onUploadImage" /><picture-filled
      /></el-icon>
      <el-popover
        v-model:visible="emojiListVisible"
        placement="top"
        :width="200"
      >
        <template #reference>
          <el-icon :size="28" @click.stop="emojiListVisible = !emojiListVisible"
            ><eleme
          /></el-icon>
        </template>
        <!-- 选择表情时不关闭弹窗, 阻止事件冒泡 -->
        <div class="emoji-list" @click.stop>
          <div
            class="emoji-btn"
            v-for="(e, i) of Emoji.emojis"
            :key="'emoji' + i"
            @click="addEmoji(e)"
          >
            {{ e }}
          </div>
        </div>
      </el-popover>
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
import { computed, ref, nextTick } from 'vue';
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
import Emoji from '@/plugins/emoji';
import { ImageHandler } from '@/utils/image';
import type { ElScrollbar } from 'element-plus';

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
const messages = computed<Message[]>(() => {
  // 确保聊天框总在最下
  toDialogBottom();
  return store.state.dialogs[`${type.value}${id.value}`] || [];
});

// 提前保存固定不变的 wrapper 高度, 减少回流
let clientHeight = 0;
nextTick(() => {
  clientHeight =
    document.querySelector('.message-list .el-scrollbar__wrap')?.clientHeight ||
    0;
});
const dialogScroll = ref<InstanceType<typeof ElScrollbar>>();
// 聊天框跳转最下方
function toDialogBottom() {
  nextTick(() => {
    const scrollHeight =
      document.querySelector('.message-list .el-scrollbar__wrap')
        ?.scrollHeight || 0;
    if (scrollHeight > clientHeight)
      dialogScroll.value!.setScrollTop(scrollHeight - clientHeight);
  });
}

/**
 * 输入框
 */
// 发送图片
const sendImage = () => {
  // 触发潜藏的 <input>
  document.getElementById('sendImageUpload')?.click();
};

function onUploadImage(event: any) {
  const e = event.target as HTMLInputElement;
  const files = e.files;
  if (files?.length) {
    const image = files[0];
    const reader = new FileReader();
    // 读取 base64 编码并发送消息
    reader.onload = function () {
      const base64 = this.result as string;
      // 先将图片显示在本地
      const localMessage: Message = {
        sender: uid.value,
        receiver: id.value,
        group: type.value === 'g' ? 1 : 0,
        type: 'image',
        timestamp: new Date().getTime(),
        payload: base64
      };
      store.commit('recvMessage', {
        k: `${type.value}${id.value}`,
        message: localMessage
      });
      toDialogBottom();
      // 拆分图像数据, 依次上传
      const imageChunks = ImageHandler.splitImage(base64);
      for (const chunk of imageChunks) {
        const msg = Object.assign({}, localMessage);
        msg.payload = JSON.stringify(chunk);
        sendMessage(msg);
      }
      // 将文件路径置空, 使得上传相同图片依然可以触发
      event.target.value = null;
    };
    reader.readAsDataURL(image);
  }
}
// 在新标签页显示完整图片
const openImage = (base64: string) => {
  const img = new Image();
  img.src = base64;
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(img.outerHTML);
    newWindow.document.title = 'DongDong | Image View';
    newWindow.document.close();
  }
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
    // 群聊中自己发的消息不需要预先显示
    store.commit('recvMessage', {
      k: `${type.value}${id.value}`,
      message
    });
    toDialogBottom();

    sendMessage(message);
    textInput.value = '';
  }
};

// 表情列表弹窗
const emojiListVisible = ref(false);
// 点击其它地方关闭弹窗
window.addEventListener('click', () => {
  if (emojiListVisible.value) emojiListVisible.value = false;
});
// 添加表情
const addEmoji = (e: string) => {
  textInput.value += e;
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
        img {
          max-width: 40vw;
        }
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
    #sendImageUpload {
      position: absolute;
      width: 0;
      height: 0;
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
.emoji-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 200px;
}
.emoji-btn {
  $size: 40px;
  margin: 4px;
  width: $size - 4px * 2;
  height: $size - 4px * 2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    background-color: #ebeef5;
  }
}
</style>
