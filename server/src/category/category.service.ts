import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { generateSlug } from '../utils/generate-slug';
import { returnCategoryObject } from './constants/return-category.object';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async byId(id: number) {
    const category = this.prisma.category.findUnique({
      where: {
        id,
      },
      select: returnCategoryObject,
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async bySlug(slug: string) {
    const category = this.prisma.category.findUnique({
      where: {
        slug,
      },
      select: returnCategoryObject,
    });
    
    if (!category) {
      throw new NotFoundException('Slug not found');
    }
    
    return category;
  }

  async getAll() {
    return this.prisma.category.findMany({
      select: returnCategoryObject,
    });
  }

  async create() {
    return this.prisma.category.create({
      data: {
        name: '',
        slug: '',
      },
    });
  }

  async update(id: number, dto: CategoryDto) {
 
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
       name: dto.name,
       slug: generateSlug(dto.name),
      },
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
  }
