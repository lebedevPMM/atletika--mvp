import { authHandlers } from './auth';
import { clubHandlers } from './club';
import { homeHandlers } from './home';

export const handlers = [
  ...authHandlers,
  ...clubHandlers,
  ...homeHandlers,
];
