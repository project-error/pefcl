import { container } from 'tsyringe';
import { DIToken, IController } from '../../../typings/common';
import mysql, { Pool } from 'mysql2/promise';

export class Bank {
  static container = container;

  bootstrap() {
    Bank.container.beforeResolution(DIToken.Controller, (_t, result: unknown) => {
      console.log('Initializing...');
    });

    Bank.container.afterResolution(DIToken.Controller, (_t, controllers: IController[]) => {
      for (const controller of controllers) {
        console.log(`Initialized ${controller.name} controller`);
      }
    });

    Bank.container.resolveAll(DIToken.Controller);
  }
}
