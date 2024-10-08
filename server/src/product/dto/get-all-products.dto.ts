import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/pagination/pagination.dto';
import { ProductSort } from '../interfaces/products-sort.enum';

export class GetAllProductsDto extends PaginationDto {
	@IsOptional()
	@IsEnum(ProductSort)
	sort?: ProductSort;

	@IsOptional()
	@IsString()
	searchTerm?: string;
}
