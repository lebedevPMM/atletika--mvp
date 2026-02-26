import { authHandlers } from './auth';
import { clubHandlers } from './club';
import { homeHandlers } from './home';
import { scheduleHandlers } from './schedule';

export const handlers = [
  ...authHandlers,
  ...clubHandlers,
  ...homeHandlers,
  ...scheduleHandlers,
];
