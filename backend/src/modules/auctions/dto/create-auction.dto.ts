import {
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({ example: 'Leilão de Imóveis - Dezembro 2024' })
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-12-01T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-15T18:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  expectedEndDate?: string;

  @ApiProperty({ type: [String], example: ['uuid-item-1', 'uuid-item-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  itemIds: string[];
}
