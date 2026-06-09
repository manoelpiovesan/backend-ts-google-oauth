import { UserRepository } from '../../src/repositories/user.repository';
import { User } from '../../src/models/user';

jest.mock('../../src/models/user');

describe('UserRepository Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' }
      ] as any[];
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      
      const result = await UserRepository.findAll({});
      expect(User.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockUsers);
    });

    it('should apply limit and offset appropriately', async () => {
      (User.findAll as jest.Mock).mockResolvedValue([]);
      await UserRepository.findAll({ page: 2, size: 5 });
      expect(User.findAll).toHaveBeenCalledWith({
        where: {},
        limit: 5,
        offset: 5,
        order: [['id', 'ASC']]
      });
    });
  });

  describe('createIfNotExists', () => {
    it('should return the user if it exists', async () => {
      const existingUser = { id: '1', google_profile_id: 'g-123' } as any;
      (User.findOne as jest.Mock).mockResolvedValue(existingUser);
      
      const result = await UserRepository.createIfNotExists({
        google_profile_id: 'g-123',
        name: 'Alice',
        email: 'alice@example.com'
      });
      
      expect(User.findOne).toHaveBeenCalledWith({ where: { google_profile_id: 'g-123' } });
      expect(result).toEqual(existingUser);
      expect(User.create).not.toHaveBeenCalled();
    });
  });
});

