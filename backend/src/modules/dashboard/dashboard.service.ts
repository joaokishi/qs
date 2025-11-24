import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '@/modules/auctions/auction.entity';
import { Item } from '@/modules/items/item.entity';
import { Bid } from '@/modules/bids/bid.entity';
import { User } from '@/modules/users/user.entity';
import { AuctionStatus } from '@/common/enums/auction.enum';
import { BidStatus } from '@/common/enums/bid.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getMetrics() {
    const [
      activeAuctions,
      totalItems,
      totalBids,
      totalUsers,
      totalRevenue,
    ] = await Promise.all([
      this.auctionRepository.count({
        where: { status: AuctionStatus.ACTIVE },
      }),
      this.itemRepository.count({ where: { active: true } }),
      this.bidRepository.count(),
      this.userRepository.count(),
      this.calculateTotalRevenue(),
    ]);

    return {
      activeAuctions,
      totalItems,
      totalBids,
      totalUsers,
      totalRevenue,
    };
  }

  async getItemsWithMostBids(limit: number = 10) {
    const result = await this.bidRepository
      .createQueryBuilder('bid')
      .select('bid.itemId', 'itemId')
      .addSelect('COUNT(bid.id)', 'bidCount')
      .addSelect('MAX(bid.amount)', 'highestBid')
      .groupBy('bid.itemId')
      .orderBy('bidCount', 'DESC')
      .limit(limit)
      .getRawMany();

    const itemIds = result.map((r) => r.itemId);
    const items = await this.itemRepository.find({
      where: { id: In(itemIds) } as any,
      relations: ['category'],
    });

    return result.map((r) => {
      const item = items.find((i) => i.id === r.itemId);
      return {
        item,
        bidCount: parseInt(r.bidCount),
        highestBid: parseFloat(r.highestBid),
      };
    });
  }

  async getRevenueByCategory() {
    const result = await this.bidRepository
      .createQueryBuilder('bid')
      .innerJoin('bid.item', 'item')
      .innerJoin('item.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('SUM(bid.amount)', 'totalRevenue')
      .addSelect('COUNT(DISTINCT bid.itemId)', 'itemCount')
      .where('bid.status = :status', { status: BidStatus.WON })
      .groupBy('category.id')
      .orderBy('totalRevenue', 'DESC')
      .getRawMany();

    return result.map((r) => ({
      category: r.categoryName,
      totalRevenue: parseFloat(r.totalRevenue || 0),
      itemCount: parseInt(r.itemCount),
    }));
  }

  async getActiveAuctionsDetails() {
    const auctions = await this.auctionRepository.find({
      where: { status: AuctionStatus.ACTIVE },
      relations: ['items', 'items.category'],
    });

    const details = await Promise.all(
      auctions.map(async (auction) => {
        const totalBids = await this.bidRepository.count({
          where: { itemId: In(auction.items.map((i) => i.id)) as any },
        });

        const expectedRevenue = auction.items.reduce(
          (sum, item) => sum + Number(item.currentValue || item.initialValue),
          0,
        );

        return {
          auction,
          totalBids,
          expectedRevenue,
          itemsCount: auction.items.length,
        };
      }),
    );

    return details;
  }

  async getTopBidders(limit: number = 10) {
    const result = await this.bidRepository
      .createQueryBuilder('bid')
      .select('bid.userId', 'userId')
      .addSelect('COUNT(bid.id)', 'bidCount')
      .addSelect('SUM(CASE WHEN bid.status = :wonStatus THEN 1 ELSE 0 END)', 'wonCount')
      .groupBy('bid.userId')
      .orderBy('bidCount', 'DESC')
      .setParameter('wonStatus', BidStatus.WON)
      .limit(limit)
      .getRawMany();

    const userIds = result.map((r) => r.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds) } as any,
      select: ['id', 'name', 'email'],
    });

    return result.map((r) => {
      const user = users.find((u) => u.id === r.userId);
      return {
        user,
        bidCount: parseInt(r.bidCount),
        wonCount: parseInt(r.wonCount),
      };
    });
  }

  private async calculateTotalRevenue(): Promise<number> {
    const result = await this.bidRepository
      .createQueryBuilder('bid')
      .select('SUM(bid.amount)', 'total')
      .where('bid.status = :status', { status: BidStatus.WON })
      .getRawOne();

    return parseFloat(result?.total || 0);
  }
}

// Importar In do typeorm
import { In } from 'typeorm';
