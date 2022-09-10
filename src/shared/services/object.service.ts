import { HashedObject } from '../models/hashed-objects';
import { ObjectType } from '../models/object-type';

export default class ObjectService {
  public static clean = (obj?: HashedObject): HashedObject | void => {
    if (!obj) {
      return;
    }

    return this.cleanEntries(this.cleanFields(obj));
  };

  private static cleanFields = (obj: HashedObject): HashedObject =>
    Object.entries(obj).reduce((newObject: HashedObject, [key, value]) => {
      if (String(value) !== '[object Object]' || Object.values?.length) {
        newObject = { ...newObject, [key]: value };
      }

      return newObject;
    }, {});

  private static cleanEntries = (obj: HashedObject): HashedObject =>
    Object.fromEntries(
      Object.entries(obj).flatMap(([key, value]) =>
        this.type(value) !== ObjectType.OBJECT
          ? [[key, value]]
          : ((value = this.cleanEntries(value)), Object.keys(value).length > 0 ? [[key, value]] : [])
      )
    );

  public static type = (value: any): ObjectType => {
    return /(?<=\s)(.*?)(?=])/.exec(Object.prototype.toString.call(value))![0].toUpperCase() as ObjectType;
  };
}
