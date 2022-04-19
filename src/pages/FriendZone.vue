<template>
  <div class="zone">
    <div class="zone-tools">
      <div class="zone-tools__refresh" @click="refreshZone">
        <el-icon :size="24"><Refresh /></el-icon>
      </div>
    </div>
    <div class="zone__header">
      <el-icon class="zone-back" :size="32" @click="back"
        ><ArrowLeft
      /></el-icon>
      <div class="zone-title">Zone</div>
      <div class="zone-actions"></div>
    </div>
    <div class="zone__main">
      <div class="no-blog" v-if="blogList.length < 1">Empty Zone</div>
      <el-scrollbar class="zone-blog-list">
        <div
          class="blog"
          v-for="(b, index) in blogList"
          :key="'blog' + b.blogId"
        >
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
                <div
                  class="blog-poster-name"
                  @click="toUserProfile(parseInt(b.userId))"
                >
                  {{ b.userName }}
                </div>
                <div class="blog-poster-time">
                  {{ fullFormatTimestamp(parseInt(b.timestamp)) }}
                </div>
              </div>
            </div>
            <div class="blog__origin" v-if="b.ownerId !== b.userId">
              <el-icon><Connection /></el-icon>
              Shared from
              <span @click="toUserProfile(parseInt(b.ownerId))"
                >{{ b.ownerName }} (ID: {{ b.ownerId }})</span
              >
            </div>
            <div class="blog__main">
              <div class="blog-text">{{ b.context }}</div>
              <div class="blog-img" v-if="b.pics.length > 0"></div>
            </div>
            <div class="blog__footer">
              <el-icon
                :size="b.liked ? 33 : 28"
                :color="b.liked ? '#409eff' : ''"
                @click="like(index)"
              >
                <template v-if="!b.liked">
                  <star />
                </template>
                <template v-else>
                  <star-filled />
                </template>
              </el-icon>
              <div class="blog-like-num">{{ b.likes }}</div>
              <el-icon :size="26" @click="reqComment(index)"
                ><chat-round
              /></el-icon>
              <el-icon :size="26" @click="reqTransfer(index)"
                ><Share
              /></el-icon>
            </div>
            <el-divider v-if="b.comments.length > 0"></el-divider>
            <div class="blog__comments" v-if="b.comments.length > 0">
              <div
                class="blog-comment"
                v-for="(c, commentIndex) in b.comments"
                :key="b.blogId + 'comment' + c.commentId"
              >
                <div class="blog-comment__user">{{ c.userName }}:</div>
                <div class="blog-comment__text">{{ c.context }}</div>
                <div
                  v-if="uid === parseInt(c.userId)"
                  class="blog-comment__delete"
                  @click="delComment(index, commentIndex)"
                >
                  Delete
                </div>
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
  Star,
  StarFilled,
  ChatRound,
  Share,
  Connection,
  Refresh
} from '@element-plus/icons-vue';
import router from '@/plugins/router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { generateAvatarColor } from '@/utils/avatar';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { ref } from 'vue';
import {
  reqDeleteComment,
  reqDislikeBlog,
  reqLikeBlog,
  reqListFriendBlog,
  reqPostComment,
  reqTransferBlog
} from '@/api/blog';
import { fullFormatTimestamp } from '@/utils/time';
import { useRoute } from 'vue-router';

// 获取路由参数
const route = useRoute();
const friendId = parseInt(route.params.id as string);

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

/**
 * 空间主体
 */
// 动态列表
const blogList = ref<Blog[]>([]);
// 获取动态
const fetchBlogList = () => {
  reqListFriendBlog(uid.value, friendId).then((res) => {
    if (res.code === 0) {
      blogList.value = res.data;
    }
  });
};
fetchBlogList();
// 跳转用户主页
const toUserProfile = (userId: number) => {
  router.push({
    path: `/home/profile/f/${userId}`
  });
};
/* 只影响到单条动态局部内容的操作在客户端直接更新，而不刷新全部动态 */
// 点赞/取消点赞
const like = (index: number) => {
  if (blogList.value[index].liked) {
    reqDislikeBlog({
      userId: uid.value,
      blogId: parseInt(blogList.value[index].blogId)
    }).then((res) => {
      if (res.code === 0) {
        blogList.value[index].liked = false;
        blogList.value[index].likes--;
      }
    });
  } else {
    reqLikeBlog({
      userId: uid.value,
      blogId: parseInt(blogList.value[index].blogId)
    }).then((res) => {
      if (res.code === 0) {
        blogList.value[index].liked = true;
        blogList.value[index].likes++;
      }
    });
  }
};
// 请求评论
const reqComment = (index: number) => {
  ElMessageBox.prompt('Write down your comment', 'Comment').then((data) => {
    if (data.value.length > 0) {
      reqPostComment({
        userId: uid.value,
        blogId: parseInt(blogList.value[index].blogId),
        context: data.value
      }).then((res) => {
        if (res.code === 0) {
          res.data.userName = store.state.userInfo.userName;
          blogList.value[index].comments.push(res.data);
        }
      });
    }
  });
};
// 请求转发
const reqTransfer = (index: number) => {
  ElMessageBox.confirm('Are you sure to share this blog ?', 'Share').then(
    () => {
      reqTransferBlog({
        userId: uid.value,
        blogId: parseInt(blogList.value[index].blogId)
      }).then((res) => {
        if (res.code === 0) {
          ElMessage.success('blog shared');
        }
      });
    }
  );
};

// 删除评论
const delComment = (index: number, commentIndex: number) => {
  ElMessageBox.confirm(
    'Are you sure to delete this comment?',
    'Delete Comment'
  ).then(() => {
    reqDeleteComment({
      userId: uid.value,
      commentId: parseInt(
        blogList.value[index].comments[commentIndex].commentId
      )
    }).then((res) => {
      if (res.code === 0) {
        blogList.value[index].comments.splice(commentIndex, 1);
      }
    });
  });
};

// 刷新空间
const refreshZone = () => {
  fetchBlogList();
};
</script>

<style lang="scss">
.zone {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-tools {
    position: fixed;
    z-index: 1;
    right: 0;
    top: 80px + 16px;
    width: 48px;
    border: 2px solid #c0c4cc;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: none;
    display: flex;
    flex-direction: column;
    > div {
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background-color 0.3s linear;
      &:hover {
        cursor: pointer;
        background-color: #ebeef5;
      }
    }
  }

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
    border-radius: 50%;
    transition: color 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  .el-dialog__body {
    padding-top: 10px;
    textarea {
      padding: 0;
      border: none;
      resize: none;
    }
  }
  .post-blog-picture {
    margin-top: 24px;
  }
  &__main {
    flex: 1;
    position: relative;
  }
  .no-blog {
    position: absolute;
    background-color: #ebeef5;
    width: 100%;
    top: 35%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 36px;
    font-weight: 300;
    user-select: none;
    z-index: 1;
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
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
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
    &__origin {
      margin-top: 12px;
      width: 100%;
      height: 32px;
      border-radius: 4px;
      background-color: #ebeef5;
      display: flex;
      align-items: center;
      padding: 0 16px;
      color: rgba(#000, $alpha: 0.5);
      user-select: none;
      i {
        margin-right: 6px;
      }
      span {
        margin-left: 8px;
        color: rgba(#000, $alpha: 0.7);
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
    &__main {
      margin-top: 16px;
    }
    &-text {
      font-size: 18px;
      line-height: 28px;
    }
    &__footer {
      height: 36px;
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
    &-like-num {
      font-weight: 300;
      font-size: 18px;
      margin-top: 4px;
      margin-left: 2px;
      user-select: none;
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
      &__delete {
        margin-left: auto;
        font-size: 12px;
        color: #909399;
        &:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
