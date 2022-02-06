import { mockData } from '@/utils/mock';

// 2.1.1 用户注册 - 邮箱
export async function reqSignUpWithEmail(params: {
  email: string;
  userName: string;
  password: string;
}) {
  return mockData(0);
}

// 2.2 用户登录
export async function reqSignIn(params: { userId: string; password: string }) {
  const mock: UserInfo = {
    userId: 0,
    userName: 'Dong Shao',
    password: '1234556',
    email: 'dongshao@nju.com',
    phone: '18356567878',
    gender: 0,
    age: 40,
    isFriend: false,
    isBlacked: false
  };
  return mockData(mock);
}

// 2.3.1 查找好友（用户）- 使用id查找
export async function reqSearchUserById(userId: number) {
  const mock: UserInfo = {
    userId: 1,
    userName: 'Feng Liu',
    password: '1234556',
    email: 'fengliu@nju.com',
    phone: '18356567878',
    gender: 0,
    age: 40,
    isFriend: false,
    isBlacked: false
  };
  return mockData(mock);
}

// 2.4 查看好友（用户）资料
export async function reqGetUserInfo(userId: number) {
  const mock: UserInfo = {
    userId: 1,
    userName: 'Feng Liu',
    password: '1234556',
    email: 'fengliu@nju.com',
    phone: '18356567878',
    gender: 0,
    age: 40,
    isFriend: false,
    isBlacked: false
  };
  return mockData(mock);
}

// 2.5.1 好友申请
export async function reqApplyFriend(params: {
  userId: number;
  friendId: number;
  msg: string;
}) {
  return mockData(null);
}

// 2.5.2 接受申请
export async function reqAcceptFriend(params: {
  userId: number;
  friendId: number;
}) {
  return mockData(null);
}

// 2.5.3 拒绝申请
export async function reqRefuseFriend(params: {
  userId: number;
  friendId: number;
}) {
  return mockData(null);
}

// 2.6 删除好友
export async function reqDeleteFriend(params: {
  userId: number;
  friendId: number;
}) {
  return mockData(null);
}

// 2.7 拉黑好友
export async function reqBlackenFriend(params: {
  userId: number;
  friendId: number;
}) {
  return mockData(null);
}

// 2.8 查看好友列表
export async function reqListFriend(userId: number) {
  const mock: UserInfo[] = [];
  for (let i = 0; i < 10; i++) {
    mock.push({
      userId: i + 1,
      userName: String.fromCharCode(69 + i) + 'eng Liu',
      password: '',
      email: '',
      phone: '',
      gender: 0,
      age: 0,
      isFriend: false,
      isBlacked: false
    });
  }
  return mockData(mock);
}
