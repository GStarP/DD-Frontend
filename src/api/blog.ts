import { mockData, mockLoadingData } from '@/utils/mock';

// 3.1 查看空间
export async function reqListBlog(userId: number) {
  const mock: Blog[] = [];
  for (let i = 0; i < 10; i++) {
    mock.push({
      blogId: i,
      userId: i % 2,
      userName: 'Qin Liu',
      timestamp: 'yesterday 13:45',
      context:
        'xxxxx xxxxxxx xx xxx xxxx xxxxxx xxxxxxxx xxxxx xxxxxx xxxxxxxxxxxx xxxx xxxxxxxx xxxxx xxxx xxxxxxx xxx xxxxxx',
      pics: [],
      liked: i % 2 == 0,
      likes: 10 + i,
      comments: [
        {
          commentId: i * 2,
          userId: 0,
          userName: 'Tongwei Ren',
          timestamp: 'today 08:00',
          context: 'SEECoder is a wonderful platform'
        },
        {
          commentId: i * 2 + 1,
          userId: 1,
          userName: 'Tongwei Ren',
          timestamp: 'today 08:00',
          context: 'SEECoder is a wonderful platform'
        }
      ]
    });
  }
  return mockLoadingData(mock, 1);
}

// 3.3 删除动态
export async function reqDeleteBlog(blogId: number) {
  return mockData(null);
}

// 3.4 发表动态
export async function reqPostBlog(params: {
  userId: number;
  timestamp: number;
  context: string;
  pics: [];
}) {
  return mockData(null);
}

// 3.5 点赞动态
export async function reqLikeBlog(params: { userId: number; blogId: number }) {
  return mockData(null);
}

// 3.8 取消喜欢
export async function reqDislikeBlog(params: {
  userId: number;
  blogId: number;
}) {
  return mockData(null);
}

// 3.7 发表评论
export async function reqPostComment(params: {
  userId: number;
  blogId: number;
  context: string;
}) {
  const mock: BlogComment = {
    commentId: 1,
    context: 'xxxxxxxxx xxxxx xxxxxx',
    userId: 0,
    userName: 'Feng Liu',
    timestamp: ''
  };
  return mockData(mock);
}

// 3.9 删除评论
export async function reqDeleteComment(params: {
  userId: number;
  commentId: number;
}) {
  return mockData(null);
}
