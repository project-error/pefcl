import { ServerUtils } from '@project-error/pe-utils';

const svUtils = new ServerUtils();

export const NetPromise = (eventName: string) => {
  return function (target: unknown, key: string) {};
};

export const PromiseEventListener = () => {
  return function <T extends { new (...args: any[]): any }>(ctr: T) {
    return class extends ctr {
      constructor(...args: any[]) {
        super(...args);

        if (!Reflect.hasMetadata('promiseEvents', this)) {
          Reflect.defineMetadata('promiseEvents', [], this);
        }

        const promiseEvents: any[] = Reflect.getMetadata('promiseEvents', this);

        for (const { eventName, key } of promiseEvents) {
          svUtils.onNetPromise(eventName, (...args) => {
            this[key](...args);
          });
        }
      }
    };
  };
};
