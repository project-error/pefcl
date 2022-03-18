import { singleton } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';
import { Bank } from '../services/Bank';
import { DIToken } from '@typings/Common';

export function Controller<T>(name: string) {
  return function (target: constructor<T>) {
    target.prototype.name = name;

    singleton()(target);
    Bank.container.registerSingleton(DIToken.Controller, target);
  };
}
