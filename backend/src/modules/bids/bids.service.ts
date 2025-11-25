import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Bid } from './bid.entity';
import { Item } from '@/modules/items/item.entity';
import { User } from '@/modules/users/user.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { BidStatus } from '@/common/enums/bid.enum';
import { AuctionStatus } from '@/common/enums/auction.enum';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private dataSource: DataSource,
  ) { }

  async placeBid(userId: string, createBidDto: CreateBidDto) {
    // Usar transação com row-level lock para evitar race conditions
    return await this.dataSource.transaction(async (manager) => {
      // Buscar item (SQLite não suporta pessimistic lock, mas a transação ainda garante isolamento)
      const item = await manager.findOne(Item, {
        where: { id: createBidDto.itemId },
        relations: ['auction'],
      });

      if (!item) {
        throw new NotFoundException('Item não encontrado');
      }

      if (!item.auctionId) {
        throw new BadRequestException('Item não está em leilão');
      }

      if (item.auction.status !== AuctionStatus.ACTIVE) {
        throw new BadRequestException('Leilão não está ativo');
      }

      if (item.auction.currentItemId !== item.id) {
        throw new BadRequestException('Este item não está sendo leiloado no momento');
      }

      const minimumBid = Number(item.currentValue) + Number(item.minimumIncrement);

      if (createBidDto.amount < minimumBid) {
        throw new BadRequestException(
          `Lance mínimo é ${minimumBid.toFixed(2)}`,
        );
      }

      // Verificar se houve alguma mudança no valor desde que o usuário viu
      const latestBid = await manager.findOne(Bid, {
        where: { itemId: item.id, status: BidStatus.WINNING },
        order: { createdAt: 'DESC' },
      });

      if (latestBid && Number(latestBid.amount) >= createBidDto.amount) {
        throw new ConflictException(
          'O valor já foi alterado por outro participante. Atualize a página.',
        );
      }

      // Marcar lances anteriores como superados
      await manager.update(
        Bid,
        { itemId: item.id, status: BidStatus.WINNING },
        { status: BidStatus.OUTBID },
      );

      // Criar novo lance
      const bid = manager.create(Bid, {
        userId,
        itemId: item.id,
        amount: createBidDto.amount,
        status: BidStatus.WINNING,
      });

      await manager.save(Bid, bid);

      // Atualizar valor atual do item
      item.currentValue = createBidDto.amount;
      await manager.save(Item, item);

      return bid;
    });
  }

  async getUserBids(userId: string) {
    return this.bidRepository.find({
      where: { userId },
      relations: ['item', 'item.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getItemBids(itemId: string) {
    return this.bidRepository.find({
      where: { itemId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
        },
      },
    });
  }

  async getWinningBids(userId: string) {
    return this.bidRepository.find({
      where: { userId, status: BidStatus.WINNING },
      relations: ['item', 'item.category', 'item.auction'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancelBid(bidId: string, adminId: string, reason: string) {
    return await this.dataSource.transaction(async (manager) => {
      const bid = await manager.findOne(Bid, {
        where: { id: bidId },
        relations: ['item'],
      });

      if (!bid) {
        throw new NotFoundException('Lance não encontrado');
      }

      if (bid.status === BidStatus.CANCELLED) {
        throw new BadRequestException('Lance já foi cancelado');
      }

      // Cancelar o lance
      bid.status = BidStatus.CANCELLED;
      bid.cancelledBy = adminId;
      bid.cancellationReason = reason;
      await manager.save(Bid, bid);

      // Encontrar o lance válido anterior
      const previousValidBid = await manager.findOne(Bid, {
        where: {
          itemId: bid.itemId,
          status: BidStatus.OUTBID,
        },
        order: { createdAt: 'DESC' },
      });

      if (previousValidBid) {
        // Restaurar lance anterior como vencedor
        previousValidBid.status = BidStatus.WINNING;
        await manager.save(Bid, previousValidBid);

        // Atualizar valor do item
        bid.item.currentValue = previousValidBid.amount;
        await manager.save(Item, bid.item);
      } else {
        // Voltar ao valor inicial
        bid.item.currentValue = bid.item.initialValue;
        await manager.save(Item, bid.item);
      }

      return { message: 'Lance cancelado com sucesso' };
    });
  }

  async markBidsAsWon(itemId: string) {
    await this.bidRepository.update(
      { itemId, status: BidStatus.WINNING },
      { status: BidStatus.WON },
    );
  }

  async getHighestBid(itemId: string): Promise<Bid | null> {
    return this.bidRepository.findOne({
      where: { itemId, status: BidStatus.WINNING },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
