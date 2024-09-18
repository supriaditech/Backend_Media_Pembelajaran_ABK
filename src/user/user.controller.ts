import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './Dto/UpdateUserDto';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('update')
  async updateUser(@Body() data: UpdateUserDto) {
    return await this.userService.updateUser(data);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post('delete')
  async deleteUser(@Body('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
