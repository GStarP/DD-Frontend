// 用户简略信息
interface UserBrief {
  userId: number;
  userName: string;
}

// 好友简略信息
interface FriendBrief {
  userId: number;
  friendId: number;
  nickname: string;
  black: 0 | 1;
}

// 带最新消息的好友信息
interface FriendBriefWithMsg {
  userId: number;
  friendId: number;
  nickname: string;
  black: 0 | 1;
  msg: string;
  msgTime: string;
  msgNum: number;
}

// 好友请求信息
interface FriendRequest {
  userId: number;
  userName: string;
  state: number;
  msg: string;
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
  friend: boolean;
  blacked: boolean;
}
