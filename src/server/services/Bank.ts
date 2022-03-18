import { container } from 'tsyringe';
import { DIToken, IController } from '@typings/common';
import { mainLogger } from '../sv_logger';

const baseLogger = mainLogger.child({ module: 'base' });

export class Bank {
  static container = container;

  bootstrap() {
    Bank.container.beforeResolution(DIToken.Controller, () => {
      baseLogger.debug('Initializing...');
    });

    Bank.container.afterResolution(DIToken.Controller, (_t, controllers: IController[]) => {
      for (const controller of controllers) {
        baseLogger.debug(`Initialized ${controller.name} controller`);
      }
    });

    Bank.container.resolveAll(DIToken.Controller);
  }
}
