import { Request } from '@typings/http';
export const Export = (name: string) => {
  return function (target: object, key: string) {
    if (!Reflect.hasMetadata('exports', target)) {
      Reflect.defineMetadata('exports', [], target);
    }

    const _exports = Reflect.getMetadata('exports', target);

    _exports.push({
      name,
      key,
    });

    Reflect.defineMetadata('exports', _exports, target);
  };
};

const exp = global.exports;

export const ExportListener = () => {
  return function <T extends { new (...args: any[]): any }>(ctr: T) {
    return class extends ctr {
      constructor(...args: any[]) {
        super(...args);

        if (!Reflect.hasMetadata('exports', this)) {
          Reflect.defineMetadata('exports', [], this);
        }

        const _exports: any[] = Reflect.getMetadata('exports', this);

        _exports.forEach(({ name, key }) => {
          exp(name, async (source: number, data: unknown, cb: (data: unknown) => void) => {
            const payload: Request = {
              data,
              source,
            };

            const result = await new Promise((resolve) => {
              return this[key](payload, resolve);
            });

            cb?.(result);

            return new Promise((resolve) => {
              resolve(result);
            });
          });
        });
      }
    };
  };
};
