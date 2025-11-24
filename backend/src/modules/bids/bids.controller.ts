import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { User } from '@/modules/users/user.entity';
import { UserRole } from '@/common/enums/user.enum';

@ApiTags('Lances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar lance' })
  @ApiResponse({ status: 201, description: 'Lance realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Lance inválido' })
  @ApiResponse({ status: 409, description: 'Conflito - valor foi alterado' })
  placeBid(@CurrentUser() user: User, @Body() createBidDto: CreateBidDto) {
    return this.bidsService.placeBid(user.id, createBidDto);
  }

  @Get('my-bids')
  @ApiOperation({ summary: 'Listar meus lances' })
  @ApiResponse({ status: 200, description: 'Lista de lances do usuário' })
  getUserBids(@CurrentUser() user: User) {
    return this.bidsService.getUserBids(user.id);
  }

  @Get('winning')
  @ApiOperation({ summary: 'Listar lances que estou ganhando' })
  @ApiResponse({ status: 200, description: 'Lances vencedores' })
  getWinningBids(@CurrentUser() user: User) {
    return this.bidsService.getWinningBids(user.id);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Listar lances de um item' })
  @ApiResponse({ status: 200, description: 'Lista de lances do item' })
  getItemBids(@Param('itemId') itemId: string) {
    return this.bidsService.getItemBids(itemId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancelar lance (Admin)' })
  @ApiResponse({ status: 200, description: 'Lance cancelado' })
  cancelBid(
    @Param('id') bidId: string,
    @CurrentUser() admin: User,
    @Body('reason') reason: string,
  ) {
    return this.bidsService.cancelBid(bidId, admin.id, reason);
  }
}
