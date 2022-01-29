interface BlogComment {
  commentId: number;
  userName: string;
  timestamp: string;
  context: string;
}

interface Blog {
  blogId: number;
  userName: string;
  userAvatar: string;
  timestamp: string;
  context: string;
  picture: string;
  liked: boolean;
  comments: BlogComment[];
}
