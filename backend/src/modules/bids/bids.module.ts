import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { Bid } from './bid.entity';
import { Item } from '@/modules/items/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Item])],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
