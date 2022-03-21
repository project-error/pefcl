export const Event = (eventName: string) => {
  return function (target: object, key: string): void {
    if (!Reflect.hasMetadata('events', target)) {
      Reflect.defineMetadata('events', [], target);
    }

    const netEvents = Reflect.getMetadata('events', target) as Array<any>;

    netEvents.push({
      eventName,
      key: key,
      net: false,
    });

    Reflect.defineMetadata('events', netEvents, target);
  };
};

export const NetEvent = (eventName: string) => {
  return function (target: any, key: string): void {
    if (!Reflect.hasMetadata('events', target)) {
      Reflect.defineMetadata('events', [], target);
    }

    const netEvents = Reflect.getMetadata('events', target) as Array<any>;

    netEvents.push({
      eventName,
      key: key,
      net: true,
    });

    Reflect.defineMetadata('events', netEvents, target);
  };
};

export const EventListener = function () {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        if (!Reflect.hasMetadata('events', this)) {
          Reflect.defineMetadata('events', [], this);
        }

        const events = Reflect.getMetadata('events', this) as Array<any>;

        for (const { net, eventName, key } of events) {
          if (net)
            onNet(eventName, (...args: any[]) => {
              this[key](...args);
            });
          else
            on(eventName, (...args: any[]) => {
              this[key](...args);
            });
        }
      }
    };
  };
};
