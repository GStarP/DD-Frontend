// @ts-ignore
import ColorHash from 'color-hash';
const colorHash = new ColorHash({
  lightness: [0.6]
});

export function generateAvatarColor(userName: string): string {
  return colorHash.hex(userName);
}
