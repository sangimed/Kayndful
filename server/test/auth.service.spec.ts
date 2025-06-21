import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import * as bcrypt from 'bcrypt';

const users = { findByPhone: jest.fn() };
const jwt = { sign: jest.fn(), verify: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(users as any, jwt as any);
    jest.clearAllMocks();
  });

  it('validates user with correct password', async () => {
    users.findByPhone.mockResolvedValue({ id: 1, phone: 'p', password: 'hash', name: 'a' });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);
    const result = await service.validateUser('p', 'pass');
    expect(result).toEqual({ id: 1, phone: 'p', name: 'a' });
  });

  it('returns null with wrong password', async () => {
    users.findByPhone.mockResolvedValue({ id: 1, password: 'hash' });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as any);
    await expect(service.validateUser('p', 'bad')).resolves.toBeNull();
  });

  it('generates tokens on login', async () => {
    jwt.sign.mockReturnValueOnce('a').mockReturnValueOnce('b');
    const result = await service.login({ id: 1, phone: 'p' });
    expect(result).toEqual({ accessToken: 'a', refreshToken: 'b' });
    expect(jwt.sign).toHaveBeenCalledTimes(2);
  });

  it('refreshes token when verify succeeds', async () => {
    jwt.verify.mockReturnValue({ username: 'p', sub: 1 });
    jwt.sign.mockReturnValueOnce('a').mockReturnValueOnce('b');
    await expect(service.refreshToken('t')).resolves.toEqual({ accessToken: 'a', refreshToken: 'b' });
  });

  it('throws when verify fails', async () => {
    jwt.verify.mockImplementation(() => { throw new Error(); });
    await expect(service.refreshToken('t')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
