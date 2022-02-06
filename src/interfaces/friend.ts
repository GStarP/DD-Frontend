// 用户简略信息
interface UserBrief {
  userId: number;
  userName: string;
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
  password: string;
  email: string;
  phone: string;
  gender: 0 | 1;
  age: number;
  isFriend: boolean;
  isBlacked: boolean;
}
