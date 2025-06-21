import { Controller, Get, Post, Body, UseGuards, Req, SerializeOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { toTransactionDto } from '../utils/mappers';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('transactions')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: `User is not authorized` })
@SerializeOptions({
    excludeExtraneousValues: true,
})
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateTransactionDto, @Req() req: any): Promise<TransactionDto> {
    const tx = await this.transactionsService.create(dto, req.user.userId);
    return toTransactionDto(tx);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<TransactionDto[]> {
    const txs = await this.transactionsService.findAll();
    return txs.map(toTransactionDto);
  }
}
