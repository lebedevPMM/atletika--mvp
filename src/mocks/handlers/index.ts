import { authHandlers } from './auth';
import { clubHandlers } from './club';
import { homeHandlers } from './home';
import { scheduleHandlers } from './schedule';
import { billingHandlers } from './billing';
import { membershipHandlers } from './membership';
import { catalogHandlers } from './catalog';
import { qrHandlers } from './qr';
import { profileHandlers } from './profile';
import { trainerHandlers } from './trainer';
import { healthHandlers } from './health';

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
  ...trainerHandlers,
  ...healthHandlers,
];
