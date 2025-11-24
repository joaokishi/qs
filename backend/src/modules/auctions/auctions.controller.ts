import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user.enum';

@ApiTags('Leilões')
@Controller('auctions')
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar leilão (Admin)' })
  @ApiResponse({ status: 201, description: 'Leilão criado' })
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os leilões' })
  @ApiResponse({ status: 200, description: 'Lista de leilões' })
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar leilões ativos' })
  @ApiResponse({ status: 200, description: 'Leilões ativos' })
  findActive() {
    return this.auctionsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar leilão por ID' })
  @ApiResponse({ status: 200, description: 'Leilão encontrado' })
  @ApiResponse({ status: 404, description: 'Leilão não encontrado' })
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar leilão (Admin)' })
  @ApiResponse({ status: 200, description: 'Leilão atualizado' })
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(id, updateAuctionDto);
  }

  @Post(':id/start')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Iniciar leilão (Admin)' })
  @ApiResponse({ status: 200, description: 'Leilão iniciado' })
  startAuction(@Param('id') id: string) {
    return this.auctionsService.startAuction(id);
  }

  @Post(':id/next')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Avançar para próximo item (Admin)' })
  @ApiResponse({ status: 200, description: 'Próximo item' })
  nextItem(@Param('id') id: string) {
    return this.auctionsService.nextItem(id);
  }

  @Post(':id/end')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Encerrar leilão (Admin)' })
  @ApiResponse({ status: 200, description: 'Leilão encerrado' })
  endAuction(@Param('id') id: string) {
    return this.auctionsService.endAuction(id);
  }
}
