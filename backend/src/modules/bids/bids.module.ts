import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { Bid } from './bid.entity';
import { Item } from '@/modules/items/item.entity';
import { AuctionsModule } from '@/modules/auctions/auctions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Item]),
    forwardRef(() => AuctionsModule),
  ],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule { }
