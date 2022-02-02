import axios from '@/plugins/axios';
import { Res } from '@/interfaces/common';
import { mockData } from '@/utils/mock';

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
