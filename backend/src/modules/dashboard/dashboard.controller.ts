import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user.enum';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas gerais do sistema (Admin)' })
  @ApiResponse({ status: 200, description: 'Métricas do dashboard' })
  getMetrics() {
    return this.dashboardService.getMetrics();
  }

  @Get('items/top-bids')
  @ApiOperation({ summary: 'Itens com mais lances (Admin)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de itens com mais lances' })
  getItemsWithMostBids(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.dashboardService.getItemsWithMostBids(limit);
  }

  @Get('revenue/by-category')
  @ApiOperation({ summary: 'Receita por categoria (Admin)' })
  @ApiResponse({ status: 200, description: 'Receita agrupada por categoria' })
  getRevenueByCategory() {
    return this.dashboardService.getRevenueByCategory();
  }

  @Get('auctions/active')
  @ApiOperation({ summary: 'Detalhes dos leilões ativos (Admin)' })
  @ApiResponse({ status: 200, description: 'Detalhes dos leilões ativos' })
  getActiveAuctionsDetails() {
    return this.dashboardService.getActiveAuctionsDetails();
  }

  @Get('bidders/top')
  @ApiOperation({ summary: 'Top participantes (Admin)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista dos maiores participantes' })
  getTopBidders(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.dashboardService.getTopBidders(limit);
  }
}
