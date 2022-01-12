import { singleton } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';
import { Bank } from '../base/Bank';

export function Controller<T>(name: string) {
  return function (target: constructor<T>) {
    target.prototype.name = name;

    singleton()(target);
    Bank.container.registerSingleton('server-controller', target);
  };
}
