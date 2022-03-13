import { mockData, mockLoadingData } from '@/utils/mock';
import axios from '@/plugins/axios';
import { Res } from '@/interfaces/common';

// 2.1.1 用户注册 - 邮箱
export async function reqSignUpWithEmail(params: {
  email: string;
  userName: string;
  password: string;
}) {
  const { data } = await axios.post<Res<number>>('/user/register-email', null, {
    params
  });
  return data;
}

// 2.2 用户登录
export async function reqSignIn(params: { userId: string; password: string }) {
  const mock: UserInfo = {
    userId: 0,
    userName: 'HXW',
    password: '',
    email: '',
    phone: '',
    age: 0,
    gender: 0,
    friend: false,
    blacked: false
  };
  return mockData(mock);
  const { data } = await axios.post<Res<UserInfo>>('/user/login', null, {
    params
  });
  return data;
}

// 2.3.1 查找好友（用户）- 使用id查找
export async function reqSearchUserById(userId: string, uid: number) {
  const { data } = await axios.get<Res<UserInfo>>('/user/search-id', {
    params: {
      userId: parseInt(userId),
      ownerId: uid
    }
  });
  return data;
  // const mock: UserInfo = {
  //   userId: 1,
  //   userName: 'Feng Liu',
  //   password: '1234556',
  //   email: 'fengliu@nju.com',
  //   phone: '18356567878',
  //   gender: 0,
  //   age: 40,
  //   friend: false,
  //   blacked: false
  // };
  // return mockData(mock);
}

// 2.3.2 查找好友（用户）- 使用昵称查找
export async function reqSearchUserByName(userName: string, uid: number) {
  const { data } = await axios.get<Res<UserInfo>>('/user/search-name', {
    params: {
      userName,
      ownerId: uid
    }
  });
  return data;
}

// 2.4 查看好友（用户）资料
export async function reqGetUserInfo(userId: number, uid: number) {
  const { data } = await axios.get<Res<UserInfo>>('/user/get-information', {
    params: {
      userId: '' + userId,
      ownerId: uid
    }
  });
  return data;
  // const mock: UserInfo = {
  //   userId,
  //   userName: String.fromCharCode(65 + userId) + 'an Zhang',
  //   password: '1234556',
  //   email: 'fengliu@nju.com',
  //   phone: '18356567878',
  //   gender: 0,
  //   age: 40,
  //   friend: false,
  //   blacked: false
  // };
  // return mockLoadingData(mock, 1);
}

// 2.5.1 好友申请
export async function reqApplyFriend(params: {
  userId: number;
  friendId: number;
  msg: string;
}) {
  const { data } = await axios.get<Res<null>>('/friend/apply', {
    params: {
      userId: '' + params.userId,
      friendId: '' + params.friendId,
      msg: params.msg
    }
  });
  return data;
}

// 2.5.2 接受申请
export async function reqAcceptFriend(params: {
  userId: number;
  friendId: number;
}) {
  const { data } = await axios.get<Res<null>>('/friend/accept', {
    params: {
      userId: '' + params.userId,
      friendId: '' + params.friendId
    }
  });
  return data;
}

// 2.5.3 拒绝申请
export async function reqRefuseFriend(params: {
  userId: number;
  friendId: number;
}) {
  const { data } = await axios.get<Res<null>>('/friend/refuse', {
    params: {
      userId: '' + params.userId,
      friendId: '' + params.friendId
    }
  });
  return data;
}

// 2.5.4 获取申请列表
export async function reqListFriendApply(userId: number) {
  const { data } = await axios.get<Res<FriendRequest[]>>(
    '/friend/get-apply-list',
    {
      params: {
        userId: '' + userId
      }
    }
  );
  return data;
}

// 2.6 删除好友
export async function reqDeleteFriend(params: {
  userId: number;
  friendId: number;
}) {
  const { data } = await axios.get<Res<null>>('/friend/delete', {
    params: {
      userId: '' + params.userId,
      friendId: '' + params.friendId
    }
  });
  return data;
}

// 2.7 拉黑好友
export async function reqBlackenFriend(params: {
  userId: number;
  friendId: number;
}) {
  const { data } = await axios.get<Res<null>>('/friend/black', {
    params: {
      userId: '' + params.userId,
      friendId: '' + params.friendId
    }
  });
  return data;
}

// 2.7.2 解除拉黑
export async function reqUnblackenFriend(params: {
  userId: number;
  friendId: number;
}) {
  const { data } = await axios.get<Res<null>>('/friend/deblack', {
    params: {
      userId: '' + params.userId,
      friendId: '' + params.friendId
    }
  });
  return data;
}

// 2.8 查看好友列表
export async function reqListFriend(userId: number) {
  const mock: FriendBrief[] = [
    {
      userId: 0,
      friendId: 1,
      nickname: 'Feng Liu'
    },
    {
      userId: 0,
      friendId: 2,
      nickname: 'Jia Liu'
    }
  ];
  return mockData(mock);
  const { data } = await axios.get<Res<FriendBrief[]>>(
    '/friend/get-friend-list',
    {
      params: {
        userId: '' + userId
      }
    }
  );
  return data;
}

// 2.9 修改个人资料
export async function reqEditUserInfo(params: {
  userId: string;
  userName: string;
  email: string;
  phone: string;
  age: number;
  gender: number;
}) {
  const { data } = await axios.post<Res<null>>('/user/set-information', null, {
    params: {
      userId: '' + params.userId,
      userName: params.userName,
      email: params.email,
      phone: params.phone,
      age: params.age,
      gender: params.gender
    }
  });
  return data;
}
