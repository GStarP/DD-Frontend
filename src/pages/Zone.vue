<template>
  <div class="zone">
    <div class="zone__header">
      <el-icon class="zone-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="zone-title">Zone</div>
      <div class="zone-actions">
        <el-icon class="zone-post" :size="32" @click="reqPostBlog"
          ><CirclePlus
        /></el-icon>
      </div>
    </div>
    <div class="zone__main">
      <el-scrollbar class="zone-blog-list">
        <div class="blog" v-for="b in blogList" :key="'blog' + b.blogId">
          <div>
            <div class="blog__header">
              <el-avatar
                class="blog-avatar"
                :style="`font-size: 24px;background-color: ${generateAvatarColor(
                  b.userName
                )}`"
                >{{ b.userName.substring(0, 1) }}</el-avatar
              >
              <div class="blog-poster">
                <div class="blog-poster-name">{{ b.userName }}</div>
                <div class="blog-poster-time">{{ b.timestamp }}</div>
              </div>
              <el-button
                v-if="uid === b.userId"
                type="text"
                class="blog-delete"
                @click="delBlog(b.blogId)"
                >Delete</el-button
              >
            </div>
            <div class="blog__main">
              <div class="blog-text">{{ b.context }}</div>
              <div class="blog-img" v-if="b.picture !== ''"></div>
            </div>
            <div class="blog__footer">
              <el-icon
                :size="b.liked ? 33 : 28"
                :color="b.liked ? '#409eff' : ''"
                @click="like(b.blogId)"
              >
                <template v-if="!b.liked">
                  <star />
                </template>
                <template v-else>
                  <star-filled />
                </template>
              </el-icon>
              <el-icon :size="26" @click="reqComment(b.blogId)"
                ><chat-round
              /></el-icon>
            </div>
            <el-divider></el-divider>
            <div class="blog__comments">
              <div
                class="blog-comment"
                v-for="c in b.comments"
                :key="b.blogId + 'comment' + c.commentId"
              >
                <div class="blog-comment__user">{{ c.userName }}:</div>
                <div class="blog-comment__text">{{ c.context }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ArrowLeft,
  CirclePlus,
  Star,
  StarFilled,
  ChatRound
} from '@element-plus/icons-vue';
import router from '@/plugins/router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';
import { useStore } from 'vuex';
import { computed } from 'vue';
/**
 * 顶部栏
 */
// Back
const back = () => {
  router.push({
    path: '/home'
  });
};
// 请求发表动态
const reqPostBlog = () => {
  ElMessage.info('req post new blog');
};
// uid
const store = useStore();
const uid = computed(() => store.state.uid as number);

/**
 * 空间主体
 */
// 动态列表
const blogList: Blog[] = [];
// mock
for (let i = 0; i < 10; i++) {
  blogList.push({
    blogId: i,
    userId: i % 2,
    userName: 'Qin Liu',
    userAvatar:
      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    timestamp: 'yesterday 13:45',
    context:
      'xxxxx xxxxxxx xx xxx xxxx xxxxxx xxxxxxxx xxxxx xxxxxx xxxxxxxxxxxx xxxx xxxxxxxx xxxxx xxxx xxxxxxx xxx xxxxxx',
    picture: '',
    liked: i % 2 == 0,
    comments: [
      {
        commentId: i * 2,
        userName: 'Tongwei Ren',
        timestamp: 'today 08:00',
        context: 'SEECoder is a wonderful platform'
      },
      {
        commentId: i * 2 + 1,
        userName: 'Tongwei Ren',
        timestamp: 'today 08:00',
        context: 'SEECoder is a wonderful platform'
      }
    ]
  });
}
// 删除动态
const delBlog = (bid: number) => {
  ElMessageBox.confirm('Are you sure to delete this blog?', 'Delete Blog').then(
    () => {
      ElMessage.info('deleted');
    }
  );
};
// 点赞
const like = (bid: number) => {
  ElMessage.info('like');
};
// 请求评论
const reqComment = (bid: number) => {
  ElMessageBox.prompt('Write down your comment', 'Comment').then((data) => {
    if (data.length > 0) {
      ElMessage.info(data.value);
    }
  });
};
</script>

<style lang="scss">
.zone {
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
    z-index: 2;
  }
  &-back {
    transition: color 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  &-title {
    font-size: 20px;
  }
  &-post {
    transition: color 0.5s, background-color 0.5s;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
      color: #fff;
      background-color: #000;
    }
  }
  &__main {
    height: 100%;
    position: relative;
  }
  &-blog-list {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ebeef5;
    .el-scrollbar__view {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .blog {
    width: 100%;
    margin-bottom: 16px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: center;

    &:first-child {
      margin-top: 16px;
    }

    > div {
      width: 600px;
      box-sizing: border-box;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
    }

    &__header {
      display: flex;
      flex-direction: row;
    }
    &-poster {
      margin-left: 12px;
      &-name {
        font-size: 18px;
        height: 30px;
      }
      &-time {
        font-size: 14px;
        color: #909399;
      }
    }
    &-delete {
      margin-left: auto;
      color: #909399;
    }
    &-text {
      margin-top: 8px;
    }
    &__footer {
      margin-top: 8px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      > i:not(:first-child) {
        margin-left: 12px;
      }
      > i:hover {
        cursor: pointer;
        color: #409eff;
      }
    }
    .el-divider--horizontal {
      margin: 16px 0;
    }
    &__comments {
      display: flex;
      flex-direction: column;
    }
    &-comment {
      display: flex;
      flex-direction: row;
      font-size: 14px;
      &:not(:first-child) {
        margin-top: 8px;
      }
      &__user {
        font-weight: bold;
      }
      &__text {
        margin-left: 6px;
      }
    }
  }
}
</style>
