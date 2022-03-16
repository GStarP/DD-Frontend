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
