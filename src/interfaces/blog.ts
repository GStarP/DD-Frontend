interface BlogComment {
  commentId: number;
  context: string;
  userId: number;
  userName: string;
  timestamp: string;
}

interface Blog {
  blogId: number;
  userId: number;
  userName: string;
  timestamp: string;
  context: string;
  pics: [];
  comments: BlogComment[];
  likes: number;
  liked: boolean;
}
