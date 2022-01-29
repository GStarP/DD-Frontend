// 查找群聊中的群组信息
interface GroupBrief {
  groupId: number;
  groupName: string;
  groupAvatar: string;
}

// 群组详细信息
interface GroupInfo {
  groupId: number;
  groupName: string;
  members: UserBrief[];
}
