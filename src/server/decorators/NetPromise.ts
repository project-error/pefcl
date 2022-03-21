import { onNetPromise } from '../lib/onNetPromise';

export const NetPromise = (eventName: string) => {
  return function (target: object, key: string) {
    if (!Reflect.hasMetadata('promiseEvents', target)) {
      Reflect.defineMetadata('promiseEvents', [], target);
    }

    const promiseEvents = Reflect.getMetadata('promiseEvents', target);

    promiseEvents.push({
      eventName,
      key,
    });

    Reflect.defineMetadata('promiseEvents', promiseEvents, target);
  };
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
          onNetPromise(eventName, async (...args: any[]) => {
            this[key](...args);
          });
        }
      }
    };
  };
};
