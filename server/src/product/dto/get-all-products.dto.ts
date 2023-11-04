import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/pagination/pagination.dto';
import { ProductSortEnum } from '../interfaces/products-sort.enum';

export class GetAllProductsDto extends PaginationDto {
	@IsOptional()
	@IsEnum(ProductSortEnum)
	sort?: ProductSortEnum;

	@IsOptional()
	@IsString()
	searchTerm?: string;
}
