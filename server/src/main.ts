import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

const logger = new Logger('Main');

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const HOST = process.env.HOST || 'localhost';
	const PORT = process.env.PORT || 5001;

	app.setGlobalPrefix('api');
	app.enableCors();
	await app.listen(PORT);
	logger.log(`Server is running on http://${HOST}:${PORT}/api`);
}

bootstrap();
