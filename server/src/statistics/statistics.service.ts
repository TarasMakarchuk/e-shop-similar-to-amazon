import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	async getMain(userId: number) {
		const user = await this.userService.byId(userId, {
			orders: {
				select: {
					items: true,
				},
			},
			reviews: true,
		});

		// TODO: add to normal SQL query in DB
		const totalAmount: number = 1000;

		console.log(user.orders);
		return [
			{
				name: 'Orders',
				value: user.orders.length,
			},
			{
				name: 'Reviews',
				value: user.reviews.length,
			},
			{
				name: 'Favorites',
				value: user.favorites.length,
			},
			{
				name: 'Total amount',
				value: totalAmount,
			},
		];
	}
	
}
