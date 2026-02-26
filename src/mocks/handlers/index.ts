import { authHandlers } from './auth';
import { clubHandlers } from './club';
import { homeHandlers } from './home';
import { scheduleHandlers } from './schedule';
import { billingHandlers } from './billing';

export const handlers = [
  ...authHandlers,
  ...clubHandlers,
  ...homeHandlers,
  ...scheduleHandlers,
  ...billingHandlers,
];
