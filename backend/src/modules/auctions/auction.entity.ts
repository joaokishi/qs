import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuctionStatus } from '@/common/enums/auction.enum';
import { Item } from '../items/item.entity';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  expectedEndDate: Date;

  @Column({ type: 'datetime', nullable: true })
  actualEndDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: AuctionStatus.SCHEDULED,
  })
  status: AuctionStatus;

  @OneToMany(() => Item, (item) => item.auction)
  items: Item[];

  @Column({ nullable: true })
  currentItemId: string;

  @Column({ type: 'datetime', nullable: true })
  currentItemEndTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
