// 好友列表中的好友信息
interface FriendBrief {
  friendId: number;
  avatar: string;
  name: string;
  recentText: string;
  recentTime: string;
}

// 查找好友中的用户信息
interface UserBrief {
  userId: number;
  userName: string;
  userAvatar: string;
}

// 好友请求信息
interface FriendRequest {
  requestId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  description: string;
}

// 用户详细信息
interface UserInfo {
  userId: number;
  userName: string;
  email: string;
  phone: string;
  gender: 0 | 1;
  age: number;
  isFriend: boolean;
  isBlacked: boolean;
}
