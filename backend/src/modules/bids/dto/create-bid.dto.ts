import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBidDto {
  @ApiProperty({ example: 'uuid-do-item' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ example: 101000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
