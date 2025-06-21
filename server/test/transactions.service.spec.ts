import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionsService } from '../src/transactions/transactions.service';

const repo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
const users = { findOne: jest.fn(), update: jest.fn() };
const offers = { findOne: jest.fn() };

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    service = new TransactionsService(repo as any, users as any, offers as any);
    jest.clearAllMocks();
  });

  it('throws NotFound when entity missing', async () => {
    users.findOne.mockRejectedValue(new NotFoundException());
    await expect(
      service.create({ toUserId: 2, serviceId: 3, points: 5 } as any, 1),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws BadRequest when insufficient points', async () => {
    users.findOne
      .mockResolvedValueOnce({ id: 1, pointsBalance: 1 })
      .mockResolvedValueOnce({ id: 2, pointsBalance: 0 });
    offers.findOne.mockResolvedValue({ id: 3 });
    await expect(
      service.create({ toUserId: 2, serviceId: 3, points: 5 } as any, 1),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('transfers points and saves transaction', async () => {
    const fromUser = { id: 1, pointsBalance: 20 };
    const toUser = { id: 2, pointsBalance: 0 };
    users.findOne
      .mockResolvedValueOnce(fromUser)
      .mockResolvedValueOnce(toUser);
    offers.findOne.mockResolvedValue({ id: 3 });
    repo.create.mockReturnValue({ id: 9 });
    repo.save.mockResolvedValue({ id: 9 });

    const result = await service.create(
      { toUserId: 2, serviceId: 3, points: 10 } as any,
      1,
    );

    expect(users.update).toHaveBeenCalledTimes(2);
    expect(repo.save).toHaveBeenCalledWith({ id: 9 });
    expect(result).toEqual({ id: 9 });
  });
});
