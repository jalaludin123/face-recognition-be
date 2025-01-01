import { arrayShuffle } from './array-helpers';

export const tumorImage = (take: number = 8) => {
  let data: string[] = [];

  [...Array(8).keys()].forEach((e) => {
    const prefix = 'dummies/tumor_';
    const index = String(e + 1).padStart(2, '0');
    const ext = e == 4 ? '.webp' : '.jpeg';

    data.push(prefix + index + ext);
  });

  data = arrayShuffle(data);

  if (take < data.length) return data.slice(0, take);

  return data;
};
