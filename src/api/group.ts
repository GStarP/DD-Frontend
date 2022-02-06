import axios from '@/plugins/axios';
import { Res } from '@/interfaces/common';
import { mockData } from '@/utils/mock';

// 1.1 查看群组列表
export async function reqListGroup(userId: number) {
  const mock: GroupBrief[] = [];
  for (let i = 0; i < 10; i++) {
    mock.push({
      groupId: i,
      groupName: String.fromCharCode(65 + i) + 'CRUM 2022'
    });
  }
  return mockData(mock);
}

// 1.2 查找群组
export async function reqSearchGroup(searchKey: string) {
  const mock: GroupSearchBrief[] = [];
  for (let i = 0; i < 10; i++) {
    mock.push({
      groupId: i,
      groupName: 'SCRUM 2022',
      in: i % 2 === 0
    });
  }
  return mockData(mock);
}
// 1.3 请求加入群组
export async function reqJoinGroup(params: {
  userId: number;
  groupId: number;
  reason: string;
}) {
  return mockData(null);
}

// 1.4 查看群组申请
export async function reqListGroupRequest(userId: number) {
  const mock: GroupRequest[] = [];
  for (let i = 0; i < 10; i++) {
    mock.push({
      requestId: i,
      group: {
        groupId: i,
        groupName: 'SCRUM 2022'
      },
      user: {
        userId: i,
        userName: 'Chunrong Fang'
      },
      reason: 'I want to learn this lesson'
    });
  }
  return mockData(mock);
}

// 1.5 同意/拒绝群组申请
export enum GroupRequestHandleType {
  ACCEPT,
  REFUSE
}
export async function reqHandleGroupRequest(parmas: {
  userId: number;
  groupRequestId: number;
  type: GroupRequestHandleType.ACCEPT | GroupRequestHandleType.REFUSE;
}) {
  return mockData(null);
}

// 1.6 创建群组
export async function reqCreateGroup(params: {
  userId: number;
  groupName: string;
}) {
  return mockData(0);
}

// 1.7 查看群组资料
export async function reqGroupInfo(groupId: number) {
  const groupInfo: GroupInfo = {
    groupId: 0,
    groupName: 'SCRUM 2020',
    members: []
  };
  for (let i = 0; i < 10; i++) {
    groupInfo.members.push({
      userId: groupId + i,
      userName: 'Gangshan Wu'
    });
  }
  return mockData(groupInfo);
}

// 1.8 退出/解散群组
export async function reqQuitGroup(params: {
  userId: number;
  groupId: number;
}) {
  return mockData(null);
}
