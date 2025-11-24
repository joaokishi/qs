import { PartialType } from '@nestjs/swagger';
import { CreateAuctionDto } from './create-auction.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { AuctionStatus } from '@/common/enums/auction.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @ApiPropertyOptional({ enum: AuctionStatus })
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;
}
