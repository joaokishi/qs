import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditAction } from '@/common/enums/audit.enum';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: AuditAction,
    userId?: string,
    metadata?: any,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const auditLog = this.auditLogRepository.create({
      action,
      userId,
      metadata,
      ipAddress,
      userAgent,
    });

    return this.auditLogRepository.save(auditLog);
  }

  async findAll(userId?: string, action?: AuditAction) {
    const query = this.auditLogRepository.createQueryBuilder('log');

    if (userId) {
      query.andWhere('log.userId = :userId', { userId });
    }

    if (action) {
      query.andWhere('log.action = :action', { action });
    }

    return query.orderBy('log.createdAt', 'DESC').take(100).getMany();
  }

  async findByUser(userId: string) {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByAction(action: AuditAction) {
    return this.auditLogRepository.find({
      where: { action },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
