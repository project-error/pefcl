import 'reflect-metadata';
import './user/user.controller';
import { Bank } from './base/Bank';

new Bank().bootstrap();

RegisterCommand(
  'getuser',
  async () => {
    console.log('hello getting user');
    emit('pefi:getUser');
  },
  false,
);
