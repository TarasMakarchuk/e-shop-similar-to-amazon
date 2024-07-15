import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll() {
		return this.reviewService.getAll();
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Post('leave/:productId')
	async leaveReview(
		@CurrentUser('id') id: number,
		@Body() dto: ReviewDto,
		@Param('productId') productId: number,
	) {
		
		return this.reviewService.create(id, dto, +productId);
	}
}
