import { api } from '@/shared/api/client';
import { clubApi } from '../api';

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

describe('clubApi', () => {
  beforeEach(() => jest.clearAllMocks());

  // --- GET endpoints ---

  describe('getMyClubs', () => {
    it('calls me/clubs', async () => {
      await clubApi.getMyClubs();
      expect(mockGet).toHaveBeenCalledWith('me/clubs');
    });
  });

  describe('getConfig', () => {
    it('calls club/config', async () => {
      await clubApi.getConfig();
      expect(mockGet).toHaveBeenCalledWith('club/config');
    });
  });

  describe('getDetails', () => {
    it('calls club/details', async () => {
      await clubApi.getDetails();
      expect(mockGet).toHaveBeenCalledWith('club/details');
    });
  });

  describe('getTeam', () => {
    it('calls club/team without params', async () => {
      await clubApi.getTeam();
      expect(mockGet).toHaveBeenCalledWith('club/team', undefined);
    });

    it('calls club/team with role filter', async () => {
      await clubApi.getTeam({ role: 'trainer' });
      expect(mockGet).toHaveBeenCalledWith('club/team', { role: 'trainer' });
    });
  });

  describe('getTeamMember', () => {
    it('calls club/team/:id', async () => {
      await clubApi.getTeamMember('member-5');
      expect(mockGet).toHaveBeenCalledWith('club/team/member-5');
    });
  });

  describe('getNews', () => {
    it('calls club/news', async () => {
      await clubApi.getNews();
      expect(mockGet).toHaveBeenCalledWith('club/news');
    });
  });

  describe('getNewsItem', () => {
    it('calls club/news/:id', async () => {
      await clubApi.getNewsItem('news-3');
      expect(mockGet).toHaveBeenCalledWith('club/news/news-3');
    });
  });

  describe('getChatMessages', () => {
    it('calls chat/messages with trainerId', async () => {
      await clubApi.getChatMessages('tr-1');
      expect(mockGet).toHaveBeenCalledWith('chat/messages', { trainerId: 'tr-1' });
    });
  });

  // --- POST endpoints ---

  describe('selectClub', () => {
    it('calls POST me/club-context with clubId and branchId', async () => {
      await clubApi.selectClub('club-1', 'branch-A');
      expect(mockPost).toHaveBeenCalledWith('me/club-context', { clubId: 'club-1', branchId: 'branch-A' });
    });
  });

  describe('sendMessage', () => {
    it('calls POST chat/messages with trainerId and text', async () => {
      await clubApi.sendMessage('tr-1', 'Hello trainer');
      expect(mockPost).toHaveBeenCalledWith('chat/messages', { trainerId: 'tr-1', text: 'Hello trainer' });
    });
  });
});
