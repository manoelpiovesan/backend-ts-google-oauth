import { UserController } from '../../src/controllers/user.controller';
import { AuthRepository } from '../../src/repositories/auth.repository';
import { UserRepository } from '../../src/repositories/user.repository';

jest.mock('../../src/repositories/auth.repository');
jest.mock('../../src/repositories/user.repository');

describe('UserController', () => {
    let controller: UserController;

    beforeEach(() => {
        controller = new UserController();
        jest.clearAllMocks();
    });

    it('me() should return current user', async () => {
        const req = { jwt_user: { id: '1', name: 'Alice' } } as any;
        const result = await controller.me(req);
        expect(result).toEqual(req.jwt_user);
    });

    it('refreshToken() should return tokens on valid refresh token', async () => {
        const req = { jwt_user: { id: '1', name: 'Alice' } } as any;
        const tokens = { access_token: '123', refresh_token: '456' };
        
        (AuthRepository.refreshToken as jest.Mock).mockResolvedValue(tokens);

        const result = await controller.refreshToken(req, 'valid-token');
        expect(result).toEqual(tokens);
        expect(AuthRepository.refreshToken).toHaveBeenCalledWith('1', 'valid-token');
    });

    it('getAll() should return all users', async () => {
        const users = [{ id: '1', name: 'Alice' }];
        (UserRepository.findAll as jest.Mock).mockResolvedValue(users);

        const result = await controller.getAll({});
        expect(result).toEqual(users);
        expect(UserRepository.findAll).toHaveBeenCalledWith({});
    });
});

