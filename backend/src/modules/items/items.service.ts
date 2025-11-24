import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { FilterItemDto } from './dto/filter-item.dto';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ItemsService {
  private uploadPath = process.env.UPLOAD_PATH || './uploads';

  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = this.itemRepository.create({
      ...createItemDto,
      currentValue: createItemDto.initialValue,
    });
    return this.itemRepository.save(item);
  }

  async findAll(filterDto?: FilterItemDto) {
    const query = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .where('item.active = :active', { active: true });

    if (filterDto?.search) {
      query.andWhere('(item.name LIKE :search OR item.description LIKE :search)', {
        search: `%${filterDto.search}%`,
      });
    }

    if (filterDto?.categoryId) {
      query.andWhere('item.categoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto?.minValue !== undefined && filterDto?.maxValue !== undefined) {
      query.andWhere('item.initialValue BETWEEN :minValue AND :maxValue', {
        minValue: filterDto.minValue,
        maxValue: filterDto.maxValue,
      });
    } else if (filterDto?.minValue !== undefined) {
      query.andWhere('item.initialValue >= :minValue', {
        minValue: filterDto.minValue,
      });
    } else if (filterDto?.maxValue !== undefined) {
      query.andWhere('item.initialValue <= :maxValue', {
        maxValue: filterDto.maxValue,
      });
    }

    return query.orderBy('item.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(id);

    if (item.auctionId) {
      throw new BadRequestException(
        'Não é possível editar um item que já está vinculado a um leilão',
      );
    }

    Object.assign(item, updateItemDto);

    if (updateItemDto.initialValue) {
      item.currentValue = updateItemDto.initialValue;
    }

    return this.itemRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);

    if (item.auctionId) {
      throw new BadRequestException(
        'Não é possível remover um item que já está vinculado a um leilão',
      );
    }

    item.active = false;
    await this.itemRepository.save(item);
    return { message: 'Item removido com sucesso' };
  }

  async uploadImages(itemId: string, files: Express.Multer.File[]) {
    const item = await this.findOne(itemId);

    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhuma imagem foi enviada');
    }

    const uploadDir = path.join(this.uploadPath, 'items', itemId);
    await fs.mkdir(uploadDir, { recursive: true });

    const imageUrls: string[] = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.originalname}`;
      const filepath = path.join(uploadDir, filename);

      // Otimizar imagem com Sharp
      await sharp(file.buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filepath);

      imageUrls.push(`/uploads/items/${itemId}/${filename}`);
    }

    item.images = [...(item.images || []), ...imageUrls];
    await this.itemRepository.save(item);

    return { images: imageUrls };
  }

  async removeImage(itemId: string, imageUrl: string) {
    const item = await this.findOne(itemId);

    if (!item.images || !item.images.includes(imageUrl)) {
      throw new NotFoundException('Imagem não encontrada');
    }

    item.images = item.images.filter((img) => img !== imageUrl);
    await this.itemRepository.save(item);

    // Remover arquivo físico
    const filepath = path.join(this.uploadPath, imageUrl.replace('/uploads/', ''));
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
    }

    return { message: 'Imagem removida com sucesso' };
  }
}
