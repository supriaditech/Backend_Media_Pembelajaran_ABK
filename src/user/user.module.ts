import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService, RolesGuard],
  controllers: [UserController],
  imports: [PrismaModule, AuthModule],
})
export class UserModule {}
