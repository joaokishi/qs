import {
  IsString,
  IsEnum,
  IsNumber,
  IsPositive,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemCondition } from '@/common/enums/item.enum';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @ApiProperty({ example: 'Casa na Praia' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Casa com 3 quartos, vista para o mar' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ItemCondition, example: ItemCondition.EXCELLENT })
  @IsEnum(ItemCondition)
  condition: ItemCondition;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  initialValue: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minimumIncrement: number;

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  images?: string[];
}
