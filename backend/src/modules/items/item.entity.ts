import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ItemCondition } from '@/common/enums/item.enum';
import { Category } from '../categories/category.entity';
import { Auction } from '../auctions/auction.entity';
import { Bid } from '../bids/bid.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ItemCondition.GOOD,
  })
  condition: ItemCondition;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  initialValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minimumIncrement: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.items, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => Auction, (auction) => auction.items, { nullable: true })
  @JoinColumn({ name: 'auctionId' })
  auction: Auction;

  @Column({ nullable: true })
  auctionId: string;

  @OneToMany(() => Bid, (bid) => bid.item)
  bids: Bid[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentValue: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
