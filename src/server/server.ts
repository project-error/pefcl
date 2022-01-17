import 'reflect-metadata';
import './server-config';
import './db/pool';
import './user/user.controller';
import './account/account.controller';
import { Bank } from './base/Bank';

new Bank().bootstrap();
