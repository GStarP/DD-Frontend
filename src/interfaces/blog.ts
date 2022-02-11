interface BlogComment {
  commentId: string;
  context: string;
  userId: string;
  userName: string;
}

interface Blog {
  blogId: string;
  userId: string;
  userName: string;
  ownerId: string;
  ownerName: string;
  timestamp: string;
  context: string;
  pics: string[];
  comments: BlogComment[];
  likes: number;
  liked: boolean;
}
