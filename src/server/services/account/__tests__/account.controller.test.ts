import { ATMInput } from '@server/../../typings/Account';
import { AccountEvents } from '@server/../../typings/Events';
import { container } from 'tsyringe';
import { AccountController } from '../account.controller';

jest.mock('../account.service');

const controller = container.resolve(AccountController);

const src = 80085;
beforeEach(() => {
  global.source = src;
});

describe('Controller: account', () => {
  test('should setup accountService & call getMyAccounts on: AccountEvents.GetAccounts', () => {
    global.source = 4;
    emitNet(AccountEvents.GetAccounts, 'resp');
    expect(controller._accountService.handleGetMyAccounts).toHaveBeenCalledWith(4);
  });

  test('should call getMyAccounts on: AccountEvents.DepositMoney', () => {
    const payload: ATMInput = {
      amount: 2,
      message: 'Example',
    };

    emitNet(AccountEvents.DepositMoney, 'resp', payload);
    expect(controller._accountService.handleDepositMoney).toHaveBeenCalledWith({
      data: payload,
      source: src,
    });
  });
});
