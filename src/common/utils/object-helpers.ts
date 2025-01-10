import { randomInt } from 'crypto';
import { getRandomInt } from './number-helpers';

export const chunck = (data: any[], perChunk: number) => {
  return data.reduce((all, one, i) => {
    const ch = Math.floor(i / perChunk);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);
};

export const groupData = (data: any[], key?: string | string[]) => {
  return data.reduce((prev, dt, i) => {
    let res = prev;

    if (
      !prev.some((e) =>
        typeof key == 'string'
          ? e[key] == dt[key]
          : Array.isArray(key)
            ? key.reduce((prev, k) => (!prev ? prev : e[k] == dt[k]), true)
            : e == dt
      )
    )
      res = [...res, dt];

    return res;
  }, []);
};

export const enumToObject = (e: any): string[] => {
  return Object.values(e).map((e) => e.toString());
};

// for compare two of object is equals or not
export const objDeepEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (obj1.constructor !== obj2.constructor) return false;
  if (typeof obj1 !== 'object') return obj1 === obj2;
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const props1 = Object.getOwnPropertyNames(obj1);
  const props2 = Object.getOwnPropertyNames(obj2);

  if (props1.length !== props2.length) return false;

  for (const prop of props1) {
    if (!props2.includes(prop)) return false;
    if (!objDeepEqual(obj1[prop], obj2[prop])) return false;
  }

  return true;
};

export const replaceNestedKeys = (
  object: Record<string, any> | any[],
  keys: { key: string; value: any }[]
): Record<string, any> | any[] => {
  keys.forEach((dt) => {
    const keyArr = dt.key.split('.');
    const lastKey = keyArr.pop();
    let nestedObject = object;
    keyArr.forEach((k) => {
      nestedObject = nestedObject[k];
    });
    nestedObject[lastKey] = dt.value;
  });

  return object;
};

export const omitObject: (
  obj: Record<string, any>,
  strs?: string[]
) => Record<string, any> = (obj, strs = []) => {
  if (!strs.length || !Object.keys(obj).length) {
    return obj;
  }

  const [first, ...rest] = strs;
  const keys = first.split('.');
  const lastKey = keys.pop();
  let curObj: Record<string, any> = obj;

  if (!first.includes('.'))
    return Object.keys(obj).reduce((prev, key) => {
      if (strs.includes(key)) return prev;

      return { ...prev, [key]: obj[key] };
    }, {});

  // loop keys for collect values
  for (const key of keys) {
    // escape when value is array
    if (Array.isArray(curObj[key]) && key == lastKey) break;

    // set current value
    curObj = typeof curObj == 'object' ? curObj[key] : undefined;
  }

  // remove data based keys
  if (Array.isArray(curObj[lastKey]))
    curObj[lastKey] = curObj[lastKey].filter((dt, i) => i !== Number(lastKey));
  else delete curObj[lastKey];

  if (rest.length) omitObject(obj, rest);

  return obj;
};

// sort keys
export const sortObjectKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.sort().map(sortObjectKeys);
  }

  if (obj instanceof Object) {
    return Object.keys(obj)
      .sort()
      .reduce(
        (result, key) => ({
          ...result,
          [key]: sortObjectKeys(obj[key]),
        }),
        {}
      );
  }

  return obj;
};

export const enumToDesc = (e: any): string => {
  return `opts: ${Object?.values(e ?? {})
    .map((e) => `\`${e.toString()}\``)
    .join(' || ')}`;
};

export const enumToKeyObject = (e: any): string[] => {
  return Object.keys(e).map((e) => e.toString());
};
export const getEnumKeyByValue = (e: any, index: string): string => {
  return Object.keys(e)[Object.values(e).findIndex((e) => e == index)];
};

export const getEnumValueRand = (e: any) => {
  const data = enumToObject(e);

  return data[randomInt(0, data.length - 1)].toString();
};

export const randomArray = (e: any): any => {
  if (!e) return null;
  const index = getRandomInt(0, e.length - 1);
  return e[index];
};

export const randomEnum = (e: any): string => {
  return randomArray(Object.values(e));
};

export const randomEnumMultiple = (e: any, limit = 2): string[] => {
  let resp: string[] = [];
  let index = 0;
  const parseValues = Object.values(e);
  const len = parseValues.length;

  while (len > 0 && index < (limit <= len ? limit : len)) {
    const value = randomArray(parseValues);
    if (!resp.includes(value)) {
      resp.push(value);
      index++;
    }
  }

  return resp;
};

export const getNestedPropertyValue = (
  obj: Record<string, any>,
  propertyPath: string
): any => {
  const properties = propertyPath.split('.');
  let value = obj;
  for (let i = 0; i < properties.length; i++) {
    value = value[properties[i]];
    if (value === undefined) {
      return undefined;
    }
  }
  return value;
};
