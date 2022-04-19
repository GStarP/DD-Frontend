// 判断字符串是否为全数字
export function isNumber(str: string) {
  return /^\d+$/.test(str);
}
