// 查找群聊中的群组信息
interface GroupBrief {
  groupId: number;
  groupName: string;
}

// 群组申请信息
interface GroupRequest {
  requestId: number;
  group: GroupBrief;
  user: UserBrief;
  reason: string;
}

// 群组详细信息
interface GroupInfo {
  groupId: number;
  groupName: string;
  members: UserBrief[];
}
