import { authHandlers } from './auth';
import { clubHandlers } from './club';
import { homeHandlers } from './home';
import { scheduleHandlers } from './schedule';
import { billingHandlers } from './billing';
import { membershipHandlers } from './membership';
import { catalogHandlers } from './catalog';
import { qrHandlers } from './qr';
import { profileHandlers } from './profile';

export const handlers = [
  ...authHandlers,
  ...clubHandlers,
  ...homeHandlers,
  ...scheduleHandlers,
  ...billingHandlers,
  ...membershipHandlers,
  ...catalogHandlers,
  ...qrHandlers,
  ...profileHandlers,
];
