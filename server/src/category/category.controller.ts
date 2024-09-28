import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll();
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug);
	}

	@Auth()
	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.categoryService.byId(+id);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+id, dto);
	}

	@Auth()
	@Post()
	async create() {
		return this.categoryService.create();
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(+id);
	}
	
}
