import axios from '@/plugins/axios';
import { Res } from '@/interfaces/common';
import { mockData } from '@/utils/mock';

// 1.1 查看群组列表
export async function reqListGroup(userId: number) {
  const { data } = await axios.get<Res<GroupBrief[]>>('/group/list', {
    params: {
      userId
    }
  });
  return data;
}

// 1.2 查找群组（群名）
export async function reqSearchGroup(params: {
  userId: number;
  searchKey: string;
}) {
  const { data } = await axios.post('/group/search', null, {
    params
  });
  return data;
}
// 1.3 请求加入群组
export async function reqJoinGroup(params: {
  userId: number;
  groupId: number;
  reason: string;
}) {
  const { data } = await axios.post('/group/request/join', null, {
    params
  });
  return data;
}

// 1.4 查看群组申请
export async function reqListGroupRequest(userId: number) {
  const { data } = await axios.get<Res<GroupRequest[]>>('/group/request/list', {
    params: {
      userId
    }
  });
  return data;
}

// 1.5 同意/拒绝群组申请
export enum GroupRequestHandleType {
  ACCEPT,
  REFUSE
}
export async function reqHandleGroupRequest(params: {
  userId: number;
  groupRequestId: number;
  type: GroupRequestHandleType.ACCEPT | GroupRequestHandleType.REFUSE;
}) {
  const { data } = await axios.post('/group/request/handle', null, {
    params
  });
  return data;
}

// 1.6 创建群组
export async function reqCreateGroup(params: {
  userId: number;
  groupName: string;
}) {
  const { data } = await axios.post('/group/create', null, {
    params
  });
  return data;
}

// 1.7 查看群组资料
export async function reqGroupInfo(groupId: number) {
  const groupInfo: GroupInfo = {
    groupId: 0,
    groupName: 'SCRUM 2020',
    members: []
  };
  const { data } = await axios.get('/group/info', {
    params: {
      groupId
    }
  });
  return data;
}

// 1.8 退出/解散群组
export async function reqQuitGroup(params: {
  userId: number;
  groupId: number;
}) {
  const { data } = await axios.post('/group/quit', null, {
    params
  });
  return data;
}
