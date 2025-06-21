import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import * as bcrypt from 'bcrypt';

const repo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService(repo as any);
    jest.clearAllMocks();
  });

  it('creates a user with hashed password', async () => {
    repo.findOne.mockResolvedValue(undefined);
    repo.create.mockReturnValue({ id: 1 });
    repo.save.mockResolvedValue({ id: 1 });
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');

    const dto: any = { phone: '123', name: 'John', password: 'pass' };
    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith({ ...dto, password: 'hashed' });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('throws conflict when phone exists', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });

    await expect(
      service.create({ phone: '123', name: 'John', password: 'pass' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates password when provided', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    repo.save.mockResolvedValue({ id: 1, name: 'New' });
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed2');

    const result = await service.update(1, { name: 'New', password: 'p2' } as any);
    expect(repo.save).toHaveBeenCalledWith({ id: 1, name: 'New', password: 'hashed2' });
    expect(result).toEqual({ id: 1, name: 'New' });
  });

  it('throws when user not found on update', async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(service.update(1, {} as any)).rejects.toBeInstanceOf(NotFoundException);
  });
});
