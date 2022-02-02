import { Res } from '@/interfaces/common';

export function mockData<T>(data: T) {
  return mockLoadingData(data, 0);
}

export function mockLoadingData<T>(data: T, second: number) {
  return new Promise<Res<T>>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data
      });
    }, second * 1000);
  });
}
