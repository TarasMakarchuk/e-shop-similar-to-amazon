import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from '../prisma.service';
import { returnUserObject } from './constants/return-user.object';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUserById(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = this.prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true,
					},
				},
				...selectObject,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (isSameUser && id !== isSameUser.id) {
			throw new BadRequestException('Email is already in use');
		}

		const user = await this.getUserById(id);

		return this.prisma.user.update({
			where: {
				id,
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password,
			},
		});
	}

	async toggleFavoriteProduct(id: number, productId: number) {
		const user = await this.getUserById(id);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const isProductExists = user.favorites.some(
			product => product.id === productId,
		);

		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				favorites: {
					[isProductExists ? 'disconnect' : 'connect']: {
						id: productId,
					},
				},
			},
		});

		return { message: 'Success' };
	}
}
