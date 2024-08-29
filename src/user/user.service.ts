import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './Dto/UpdateUserDto';
import { buildResponse } from 'helper/buildResponse';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async updateUser(data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      throw new HttpException(
        buildResponse(null, 'User not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return buildResponse(
      updatedUser,
      'User profile updated successfully',
      HttpStatus.OK,
    );
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany();

    return buildResponse(users, 'Users retrieved successfully', HttpStatus.OK);
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        buildResponse(null, 'User not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return buildResponse(null, 'User deleted successfully', HttpStatus.OK);
  }
}
