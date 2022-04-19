import { v4 } from 'uuid';

// 修改 base64 图片分辨率
export function scaleImage(
  base64: string,
  size: {
    w: number;
    h: number;
  }
) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.src = base64;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = Math.min(image.width, size.w);
      canvas.height = Math.min(image.height, size.h);
      ctx?.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      resolve(canvas.toDataURL());
    };
  });
}

interface ImageChunk {
  id: string;
  no: number; // 当前 chunk 编号
  total: number; // 全部 chunk 数量
  data: string; // 当前 chunk 数据
}

// 将图像数据分割/合并
export const ImageHandler = {
  imageMap: {} as { [key: string]: ImageChunk[] },
  CHUNK_SIZE: 1800,
  splitImage(base64: string) {
    // 将图片拆成多个 chunk
    const chunkNum = Math.ceil(base64.length / this.CHUNK_SIZE);
    const imageChunks = [];
    // 每张图片绑定一个 UUID
    const uuid = v4();
    // no 从 1 开始!
    for (let i = 1; i <= chunkNum; i++) {
      imageChunks.push({
        id: uuid,
        no: i,
        total: chunkNum,
        data: base64.substring((i - 1) * this.CHUNK_SIZE, i * this.CHUNK_SIZE)
      });
    }
    return imageChunks;
  },
  mergeImage(chunk: ImageChunk, cb: (base64: string) => void) {
    // 将收到的 chunk 加入 map 中
    if (Object.keys(this.imageMap).indexOf(chunk.id) !== -1) {
      this.imageMap[chunk.id].push(chunk);
    } else {
      this.imageMap[chunk.id] = [chunk];
    }
    // 检查此图片的全部 chunk 是否完整, 若完整则执行回调
    const chunks = this.imageMap[chunk.id];
    if (chunks.length === chunk.total) {
      // 按 no 顺序排序
      chunks.sort((a, b) => a.no - b.no);
      // 组合数据
      let base64 = '';
      for (const c of chunks) {
        base64 += c.data;
      }
      cb(base64);
    }
  }
};
