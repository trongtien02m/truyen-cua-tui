import { storage } from '@/store/mmkvStore';
import { StoreValueType } from '@/types/StoreValueType';

const parseJson = (jsonData: string) => {
  try {
    return JSON.parse(jsonData);
  } catch {
    return jsonData;
  }
};

const stringifyJson = (data: object) => {
  try {
    return JSON.stringify(data);
  } catch {
    return data;
  }
};

export const get = (
  key: string,
  type: StoreValueType = StoreValueType.String,
) => {
  switch (type) {
    case StoreValueType.String:
      return storage.getString(key);
    case StoreValueType.Number:
      return storage.getNumber(key);
    case StoreValueType.Boolean:
      return storage.getBoolean(key);
    case StoreValueType.Object:
      const jsonData = storage.getString(key);
      return jsonData ? parseJson(jsonData) : undefined;
  }
};

export const set = (key: string, value: any) => {
  const parseValue = typeof value === 'object' ? stringifyJson(value) : value;

  storage.set(key, parseValue);
};
