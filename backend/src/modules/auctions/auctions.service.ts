import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Auction } from './auction.entity';
import { Item } from '@/modules/items/item.entity';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuctionStatus } from '@/common/enums/auction.enum';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) { }

  async create(createAuctionDto: CreateAuctionDto) {
    const { itemIds, ...auctionData } = createAuctionDto;

    // Verificar se os itens existem e estão disponíveis
    const items = await this.itemRepository.find({
      where: { id: In(itemIds), active: true },
    });

    if (items.length !== itemIds.length) {
      throw new BadRequestException('Um ou mais itens não foram encontrados');
    }

    // Verificar se algum item já está em outro leilão
    const itemsInAuction = items.filter((item) => item.auctionId);
    if (itemsInAuction.length > 0) {
      throw new BadRequestException(
        'Um ou mais itens já estão vinculados a outro leilão',
      );
    }

    const auction = this.auctionRepository.create(auctionData);
    const savedAuction = await this.auctionRepository.save(auction);

    // Vincular itens ao leilão
    await this.itemRepository.update(
      { id: In(itemIds) },
      { auctionId: savedAuction.id },
    );

    return this.findOne(savedAuction.id);
  }

  async findAll() {
    return this.auctionRepository.find({
      relations: ['items', 'items.category'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['items', 'items.category'],
    });

    if (!auction) {
      throw new NotFoundException('Leilão não encontrado');
    }

    return auction;
  }

  async findActive() {
    return this.auctionRepository.find({
      where: { status: AuctionStatus.ACTIVE },
      relations: ['items', 'items.category'],
    });
  }

  async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    const auction = await this.findOne(id);

    if (auction.status === AuctionStatus.COMPLETED) {
      throw new BadRequestException(
        'Não é possível editar um leilão concluído',
      );
    }

    if (updateAuctionDto.itemIds) {
      const { itemIds, ...auctionData } = updateAuctionDto;

      const items = await this.itemRepository.find({
        where: { id: In(itemIds), active: true },
      });

      if (items.length !== itemIds.length) {
        throw new BadRequestException('Um ou mais itens não foram encontrados');
      }

      // Remover vinculação dos itens antigos
      await this.itemRepository.update(
        { auctionId: auction.id },
        { auctionId: null },
      );

      // Vincular novos itens
      await this.itemRepository.update(
        { id: In(itemIds) },
        { auctionId: auction.id },
      );

      Object.assign(auction, auctionData);
    } else {
      Object.assign(auction, updateAuctionDto);
    }

    return this.auctionRepository.save(auction);
  }

  async startAuction(id: string) {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.SCHEDULED) {
      throw new BadRequestException('Leilão já foi iniciado');
    }

    if (!auction.items || auction.items.length === 0) {
      throw new BadRequestException('Leilão não possui itens');
    }

    auction.status = AuctionStatus.ACTIVE;
    auction.currentItemId = auction.items[0].id;
    auction.currentItemEndTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    return this.auctionRepository.save(auction);
  }

  async nextItem(id: string) {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new BadRequestException('Leilão não está ativo');
    }

    const currentIndex = auction.items.findIndex(
      (item) => item.id === auction.currentItemId,
    );

    if (currentIndex === -1 || currentIndex === auction.items.length - 1) {
      // Último item - encerrar leilão
      return this.endAuction(id);
    }

    auction.currentItemId = auction.items[currentIndex + 1].id;
    auction.currentItemEndTime = new Date(Date.now() + 5 * 60 * 1000);

    return this.auctionRepository.save(auction);
  }

  async endAuction(id: string) {
    const auction = await this.findOne(id);

    auction.status = AuctionStatus.COMPLETED;
    auction.actualEndDate = new Date();
    auction.currentItemId = null;
    auction.currentItemEndTime = null;

    return this.auctionRepository.save(auction);
  }

  async extendItemTime(auctionId: string, seconds: number = 15) {
    const auction = await this.findOne(auctionId);

    if (auction.status !== AuctionStatus.ACTIVE || !auction.currentItemEndTime) {
      throw new BadRequestException('Leilão não está ativo');
    }

    auction.currentItemEndTime = new Date(
      auction.currentItemEndTime.getTime() + seconds * 1000,
    );

    return this.auctionRepository.save(auction);
  }

  // Cron job para verificar e encerrar itens automaticamente
  @Cron(CronExpression.EVERY_5_SECONDS)
  async checkAuctionTimers() {
    try {
      const activeAuctions = await this.auctionRepository.find({
        where: { status: AuctionStatus.ACTIVE },
      });

      // Se não houver leilões ativos, não faz nada
      if (activeAuctions.length === 0) {
        return;
      }

      for (const auction of activeAuctions) {
        if (
          auction.currentItemEndTime &&
          new Date() >= auction.currentItemEndTime
        ) {
          await this.nextItem(auction.id);
        }
      }
    } catch (error) {
      // Silently ignore errors during startup when tables don't exist yet
      // This prevents the cron job from crashing the application
    }
  }
}
