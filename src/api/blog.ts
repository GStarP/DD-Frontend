import { mockData, mockLoadingData } from '@/utils/mock';
import axios from '@/plugins/axios';
import { Res } from '@/interfaces/common';

// 3.1 查看空间
export async function reqListBlog(userId: number) {
  const { data } = await axios.get<Res<Blog[]>>('/space/list', {
    params: {
      userId: '' + userId
    }
  });
  return data;
}

// 3.3 删除动态
export async function reqDeleteBlog(blogId: number) {
  const { data } = await axios.post<Res<null>>('/space/delete', null, {
    params: {
      blogId: '' + blogId
    }
  });
  return data;
}

// 3.4 发表动态
export async function reqPostBlog(params: {
  userId: string;
  context: string;
  pics: string[];
}) {
  const { data } = await axios.post<Res<null>>('/space/add', params);
  return data;
}

// 3.5 点赞动态
export async function reqLikeBlog(params: { userId: number; blogId: number }) {
  const { data } = await axios.post<Res<null>>('/space/like', null, {
    params: {
      userId: '' + params.userId,
      blogId: '' + params.blogId
    }
  });
  return data;
}

// 3.8 取消喜欢
export async function reqDislikeBlog(params: {
  userId: number;
  blogId: number;
}) {
  const { data } = await axios.post<Res<null>>('/space/dislike', null, {
    params: {
      userId: '' + params.userId,
      blogId: '' + params.blogId
    }
  });
  return data;
}

// 3.7 发表评论
export async function reqPostComment(params: {
  userId: number;
  blogId: number;
  context: string;
}) {
  const { data } = await axios.post<Res<BlogComment>>('/space/comment', null, {
    params: {
      userId: '' + params.userId,
      blogId: '' + params.blogId,
      context: '' + params.context
    }
  });
  return data;
}

// 3.9 删除评论
export async function reqDeleteComment(params: {
  userId: number;
  commentId: number;
}) {
  const { data } = await axios.post<Res<null>>('/space/deleteComment', null, {
    params: {
      commentId: '' + params.commentId
    }
  });
  return data;
}
