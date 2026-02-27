import { api } from '@/shared/api/client';
import { healthApi } from '../api';

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
}));

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;
const mockDelete = (api as any).delete as jest.Mock;

describe('healthApi', () => {
  beforeEach(() => jest.clearAllMocks());

  // --- GET endpoints ---

  describe('getVisitStats', () => {
    it('calls me/stats/visits', async () => {
      await healthApi.getVisitStats();
      expect(mockGet).toHaveBeenCalledWith('me/stats/visits');
    });
  });

  describe('getContraindications', () => {
    it('calls me/contraindications', async () => {
      await healthApi.getContraindications();
      expect(mockGet).toHaveBeenCalledWith('me/contraindications');
    });
  });

  describe('getFamily', () => {
    it('calls me/family', async () => {
      await healthApi.getFamily();
      expect(mockGet).toHaveBeenCalledWith('me/family');
    });
  });

  describe('getDocuments', () => {
    it('calls me/documents', async () => {
      await healthApi.getDocuments();
      expect(mockGet).toHaveBeenCalledWith('me/documents');
    });
  });

  describe('getFavorites', () => {
    it('calls me/favorites', async () => {
      await healthApi.getFavorites();
      expect(mockGet).toHaveBeenCalledWith('me/favorites');
    });
  });

  // --- POST endpoints ---

  describe('addContraindication', () => {
    it('calls POST me/contraindications with data', async () => {
      const data = { title: 'Allergy', description: 'Peanut allergy', severity: 'high' };
      await healthApi.addContraindication(data);
      expect(mockPost).toHaveBeenCalledWith('me/contraindications', data);
    });
  });

  // --- DELETE endpoints ---

  describe('removeContraindication', () => {
    it('calls DELETE me/contraindications/:id', async () => {
      await healthApi.removeContraindication('contra-1');
      expect(mockDelete).toHaveBeenCalledWith('me/contraindications/contra-1');
    });
  });

  describe('removeFavorite', () => {
    it('calls DELETE me/favorites/:id', async () => {
      await healthApi.removeFavorite('fav-3');
      expect(mockDelete).toHaveBeenCalledWith('me/favorites/fav-3');
    });
  });
});
