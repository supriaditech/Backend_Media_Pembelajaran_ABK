import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { buildResponse } from 'helper/buildResponse';
import { hash, compare } from 'bcrypt';
import { getCurrentLocalTime } from 'helper/date-helper';
import { LoginDto } from './dto/LoginDto';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt_config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async RegisterUserService(data: CreateUserDto) {
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (checkUserExists) {
      throw new HttpException(
        buildResponse(null, 'User Already Registered', HttpStatus.FOUND),
        HttpStatus.FOUND,
      );
    }

    data.password = await hash(data.password, 12);
    const currentDateTime = getCurrentLocalTime();
    const createUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        createdAt: currentDateTime,
        updatedAt: currentDateTime,
      },
    });

    if (createUser) {
      return buildResponse(createUser, 'Register Successful', HttpStatus.OK);
    } else {
      return buildResponse(null, 'Please check data', HttpStatus.BAD_REQUEST);
    }
  }

  async login(data: LoginDto) {
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!checkUserExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await compare(
      data.password,
      checkUserExists.password,
    );
    if (checkPassword) {
      const accessToken = this.generateJWT({
        sub: checkUserExists.id,
        name: checkUserExists.name,
        email: checkUserExists.email,
        role: checkUserExists.role,
      });
      return buildResponse(
        { accessToken, user: checkUserExists },
        'Login successful',
        HttpStatus.OK,
      );
    } else {
      throw new HttpException(
        'User or password not match',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async ProfileDetailService(userId: any) {
    const Id = userId.id;
    const getProfileDetail = await this.prisma.user.findFirst({
      where: {
        id: Id,
      },
    });

    if (getProfileDetail) {
      return buildResponse(
        getProfileDetail,
        'Data Profile berhasil di muat',
        HttpStatus.OK,
      );
    } else {
      throw new HttpException(
        'Data Profile gagal di muat',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  generateJWT(payload: any) {
    return this.jwtService.sign(payload, {
      secret: jwt_config.secret,
      expiresIn: jwt_config.expired,
    });
  }
}
