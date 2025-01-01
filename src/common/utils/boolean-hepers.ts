export const isUuid = (val?: string): boolean => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(val); // true
};

export const isFileIsGcp = (url?: string | null): boolean =>
  (url ?? '').split('/')[0] == 'storages';

export const isProd = (): boolean => process.env.NODE_ENV == 'production';

export const isUseDocker = (): boolean => process.env.USE_DOCKER == 'true';

export const isAssetLocal = (): boolean => process.env.ASSET_TYPE == 'local';

export const isAssetGcp = (): boolean => process.env.ASSET_TYPE == 'gcp';

export const notEmpty = (val: any): boolean => {
  switch (typeof val) {
    case 'object':
      return val != null && Object.values(val).length > 0;
      break;
    case 'string':
      return val.length > 0;
      break;
    case 'undefined':
      return false;
      break;
    default:
      return true;
  }
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
