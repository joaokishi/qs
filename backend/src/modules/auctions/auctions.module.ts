import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { AuctionGateway } from './auction.gateway';
import { Auction } from './auction.entity';
import { Item } from '@/modules/items/item.entity';
import { BidsModule } from '@/modules/bids/bids.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Item]),
    BidsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionGateway],
  exports: [AuctionsService, AuctionGateway],
})
export class AuctionsModule {}
