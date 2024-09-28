import { Body, Controller, Get, Param, Patch, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getUserById(id);
  }

  @UsePipes(new ValidationPipe())
  @Put('profile/update')
  @Auth()
  async update(@CurrentUser('id') id: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }

  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string,
  ) {
    return this.userService.toggleFavoriteProduct(id, +productId);
  }
  
}
