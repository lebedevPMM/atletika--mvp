import { authHandlers } from './auth';
import { clubHandlers } from './club';

export const handlers = [
  ...authHandlers,
  ...clubHandlers,
];
