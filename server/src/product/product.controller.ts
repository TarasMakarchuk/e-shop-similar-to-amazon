import { Controller, Get, Param, Post, Query, UsePipes, ValidationPipe, Put, Body, Delete } from '@nestjs/common';

import { ProductService } from './product.service';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
  async getAll(@Query() queryDto: GetAllProductsDto) {
		return this.productService.getAll(queryDto);
	}

  @Auth()
	@Get(':id')
	async getProduct(@Param('id') id: string) {
		return this.productService.byId(+id);
  }
  
	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id);
	}

	@Get('by-slug/:slug')
	async getProductBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug);
	}

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug);
	}

  @UsePipes(new ValidationPipe())
  @Auth()
	@Post()
	async createProduct() {
		return this.productService.create();
  }
  
  @UsePipes(new ValidationPipe())
  @Auth()
	@Put(':id')
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto);
  }  
  
  @Auth()
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id);
	}
	
}
