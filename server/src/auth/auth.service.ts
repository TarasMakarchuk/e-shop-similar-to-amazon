import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../prisma.service';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const {email} = dto;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) throw new BadRequestException('User is already exists');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.internet.userName(),
        avatarPath: faker.image.avatar(),
        phone: faker.helpers.replaceSymbolWithNumber('+3 (###) ###-##-##'),
        password: await hash(dto.password),
      },
    });

    return user;
  }

  private async issueTokens(userId: number) {
    const data = {id: userId};

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
