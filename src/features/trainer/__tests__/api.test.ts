import { api } from '@/shared/api/client';
import { trainerApi } from '../api';

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

describe('trainerApi', () => {
  beforeEach(() => jest.clearAllMocks());

  // --- GET endpoints ---

  describe('getDayOverview', () => {
    it('calls trainer/day-overview without params when no date given', async () => {
      await trainerApi.getDayOverview();
      expect(mockGet).toHaveBeenCalledWith('trainer/day-overview', undefined);
    });

    it('calls trainer/day-overview with date param when date given', async () => {
      await trainerApi.getDayOverview('2026-03-01');
      expect(mockGet).toHaveBeenCalledWith('trainer/day-overview', { date: '2026-03-01' });
    });
  });

  describe('getSchedule', () => {
    it('calls trainer/schedule with from and to params', async () => {
      await trainerApi.getSchedule('2026-03-01', '2026-03-07');
      expect(mockGet).toHaveBeenCalledWith('trainer/schedule', { from: '2026-03-01', to: '2026-03-07' });
    });
  });

  describe('getSession', () => {
    it('calls trainer/sessions/:id', async () => {
      await trainerApi.getSession('sess-42');
      expect(mockGet).toHaveBeenCalledWith('trainer/sessions/sess-42');
    });
  });

  describe('getClients', () => {
    it('calls trainer/clients', async () => {
      await trainerApi.getClients();
      expect(mockGet).toHaveBeenCalledWith('trainer/clients');
    });
  });

  describe('getClient', () => {
    it('calls trainer/clients/:id', async () => {
      await trainerApi.getClient('client-7');
      expect(mockGet).toHaveBeenCalledWith('trainer/clients/client-7');
    });
  });

  describe('getProfile', () => {
    it('calls trainer/me', async () => {
      await trainerApi.getProfile();
      expect(mockGet).toHaveBeenCalledWith('trainer/me');
    });
  });

  describe('getClientPlan', () => {
    it('calls trainer/clients/:id/plan', async () => {
      await trainerApi.getClientPlan('client-7');
      expect(mockGet).toHaveBeenCalledWith('trainer/clients/client-7/plan');
    });
  });

  describe('getDaySummary', () => {
    it('calls trainer/day-summary without params when no date given', async () => {
      await trainerApi.getDaySummary();
      expect(mockGet).toHaveBeenCalledWith('trainer/day-summary', undefined);
    });

    it('calls trainer/day-summary with date param when date given', async () => {
      await trainerApi.getDaySummary('2026-03-01');
      expect(mockGet).toHaveBeenCalledWith('trainer/day-summary', { date: '2026-03-01' });
    });
  });

  describe('getClientProgress', () => {
    it('calls trainer/clients/:id/progress', async () => {
      await trainerApi.getClientProgress('client-7');
      expect(mockGet).toHaveBeenCalledWith('trainer/clients/client-7/progress');
    });
  });

  describe('getNotifications', () => {
    it('calls trainer/notifications', async () => {
      await trainerApi.getNotifications();
      expect(mockGet).toHaveBeenCalledWith('trainer/notifications');
    });
  });

  // --- POST endpoints ---

  describe('markAttendance', () => {
    it('calls POST trainer/sessions/:id/attend', async () => {
      await trainerApi.markAttendance('sess-42');
      expect(mockPost).toHaveBeenCalledWith('trainer/sessions/sess-42/attend');
    });
  });

  describe('cancelSession', () => {
    it('calls POST trainer/sessions/:id/cancel', async () => {
      await trainerApi.cancelSession('sess-42');
      expect(mockPost).toHaveBeenCalledWith('trainer/sessions/sess-42/cancel');
    });
  });

  describe('updateProfile', () => {
    it('calls POST trainer/me with profile data', async () => {
      const data = { bio: 'New bio' };
      await trainerApi.updateProfile(data);
      expect(mockPost).toHaveBeenCalledWith('trainer/me', data);
    });
  });

  describe('endShift', () => {
    it('calls POST trainer/shift/end with shift data', async () => {
      const data = { date: '2026-03-01', notes: 'All done' };
      await trainerApi.endShift(data);
      expect(mockPost).toHaveBeenCalledWith('trainer/shift/end', data);
    });

    it('sends only date when notes not provided', async () => {
      const data = { date: '2026-03-01' };
      await trainerApi.endShift(data);
      expect(mockPost).toHaveBeenCalledWith('trainer/shift/end', data);
    });
  });

  describe('readAllNotifications', () => {
    it('calls POST trainer/notifications/read-all', async () => {
      await trainerApi.readAllNotifications();
      expect(mockPost).toHaveBeenCalledWith('trainer/notifications/read-all');
    });
  });
});
