import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import {
	returnProductObject,
	returnProductObjectFullest,
} from './constants/return-product.object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { PaginationService } from '../pagination/pagination.service';
import { ProductSortEnum } from './interfaces/products-sort.enum';

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
	) {}

  async getAll(dto: GetAllProductsDto = {}) {
		const { sort, searchTerm } = dto;
		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

		if (sort === ProductSortEnum.LOW_PRICE) {
			prismaSort.push({ price: 'asc' });
		} else if (sort === ProductSortEnum.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' });
		} else if (sort === ProductSortEnum.OLDEST) {
			prismaSort.push({ createdAt: 'asc' });
		} else {
			prismaSort.push({ createdAt: 'desc' });
    }
    
    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						},
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
					],
			  }
			: {};
    
    const { perPage, skip } = this.paginationService.getPagination(dto);
		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
		});
    
    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    };
	}

	async byId(id: number) {
		const product = this.prisma.product.findUnique({
			where: {
				id,
			},
			select: returnProductObjectFullest,
		});
		
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		return product;
	}

	async bySlug(slug: string) {
		const category = this.prisma.product.findUnique({
			where: {
				slug,
			},
			select: returnProductObjectFullest,
		});

		if (!category) {
			throw new NotFoundException('Slug not found');
		}

		return category;
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug,
				},
			},
			select: returnProductObjectFullest,
		});
		
		if (!products) throw new NotFoundException('Products not found');

		return products;
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id);

		if (!currentProduct)
			throw new NotFoundException('Current product not found');

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name,
				},
				NOT: {
					id: currentProduct.id,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			select: returnProductObject,
		});

		if (!products) throw new NotFoundException('Products not found');

		return products;
	}

	async create() {
		const product = await this.prisma.product.create({
			data: {
				description: '',
				name: '',
				price: 0,
				slug: '',
			},
		});
		
		return product.id;
	}

	async update(id: number, dto: ProductDto) {
		const { description, images, price, name, categoryId } = dto;

		return this.prisma.product.update({
			where: {
				id,
			},
			data: {
				description,
				images,
				price,
				name,
				slug: generateSlug(name),
				category: {
					connect: {
						id: categoryId,
					},
				},
			},
		});
	}

	async delete(id: number) {
		return this.prisma.product.delete({
			where: {
				id,
			},
		});
	}
}
