import { NotFoundException } from '@nestjs/common';
import { ServiceOffersService } from '../src/service-offers/service-offers.service';

const repo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};
const users = { findOne: jest.fn() };

describe('ServiceOffersService', () => {
  let service: ServiceOffersService;

  beforeEach(() => {
    service = new ServiceOffersService(repo as any, users as any);
    jest.clearAllMocks();
  });

  it('creates offer linked to provider', async () => {
    users.findOne.mockResolvedValue({ id: 1 });
    repo.create.mockReturnValue({ id: 2 });
    repo.save.mockResolvedValue({ id: 2 });
    const dto: any = { title: 't', description: 'd', category: 'c', pointCost: 1, availability: true };
    const result = await service.create(dto, 1);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, provider: { id: 1 } });
    expect(repo.save).toHaveBeenCalledWith({ id: 2 });
    expect(result).toEqual({ id: 2 });
  });

  it('updates existing offer', async () => {
    repo.findOne.mockResolvedValue({ id: 3, title: 'old' });
    repo.save.mockResolvedValue({ id: 3, title: 'new' });
    const result = await service.update(3, { title: 'new' } as any);
    expect(repo.save).toHaveBeenCalledWith({ id: 3, title: 'new' });
    expect(result).toEqual({ id: 3, title: 'new' });
  });

  it('throws when offer not found', async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(service.update(3, {} as any)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes offer', async () => {
    repo.delete.mockResolvedValue({ affected: 1 });
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('throws when removing missing offer', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findAll returns offers', async () => {
    repo.find.mockResolvedValue([1, 2]);
    await expect(service.findAll()).resolves.toEqual([1, 2]);
  });

  it('findOne returns offer', async () => {
    repo.findOne.mockResolvedValue({ id: 5 });
    await expect(service.findOne(5)).resolves.toEqual({ id: 5 });
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 5 }, relations: ['provider'] });
  });

  it('throws when offer not found on findOne', async () => {
    repo.findOne.mockResolvedValue(undefined);
    await expect(service.findOne(5)).rejects.toBeInstanceOf(NotFoundException);
  });
});
