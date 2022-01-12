import { container } from 'tsyringe';
import { DIToken, IController } from '../../../typings/common';

export class Bank {
  static container = container;

  bootstrap() {
    Bank.container.beforeResolution(DIToken.Controller, (_t, result: unknown) => {
      console.log('Initializing...');
    });

    Bank.container.afterResolution(DIToken.Controller, (_t, controllers: IController[]) => {
      for (const controller of controllers) {
        console.log(`Initialized ${controller.name}`);
      }
    });

    Bank.container.resolveAll(DIToken.Controller);
  }
}
