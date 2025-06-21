import { User } from '../users/user.entity';
import { ServiceOffer } from '../service-offers/service-offer.entity';
import { Transaction } from '../transactions/transaction.entity';
import { UserDto } from '../users/dto/user.dto';
import { ServiceOfferDto } from '../service-offers/dto/service-offer.dto';
import { TransactionDto } from '../transactions/dto/transaction.dto';

export function toUserDto(user: User): UserDto {
  const { password, offers, outgoingTransactions, incomingTransactions, ...rest } = user;
  return rest as UserDto;
}

export function toServiceOfferDto(offer: ServiceOffer): ServiceOfferDto {
  return {
    ...offer,
    provider: toUserDto(offer.provider),
  } as ServiceOfferDto;
}

export function toTransactionDto(transaction: Transaction): TransactionDto {
  return {
    ...transaction,
    fromUser: toUserDto(transaction.fromUser),
    toUser: toUserDto(transaction.toUser),
    service: toServiceOfferDto(transaction.service),
  } as TransactionDto;
}
