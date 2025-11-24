import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user.enum';
import { AuditAction } from '@/common/enums/audit.enum';

@ApiTags('Auditoria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Listar logs de auditoria (Admin)' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'action', required: false, enum: AuditAction })
  @ApiResponse({ status: 200, description: 'Logs de auditoria' })
  findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
  ) {
    return this.auditService.findAll(userId, action);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Logs de um usuário específico (Admin)' })
  @ApiResponse({ status: 200, description: 'Logs do usuário' })
  findByUser(@Query('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }
}
