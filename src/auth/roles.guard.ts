import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Pastikan user tidak undefined

    if (!user || !user.id) {
      return false;
    }

    // Temukan pengguna berdasarkan ID dari JWT
    const foundUser = await this.prisma.user.findUnique({
      where: { id: user.id }, // Pastikan id berasal dari request.user
    });

    // Cek apakah pengguna adalah ADMIN
    if (foundUser && foundUser.role === 'ADMIN') {
      return true;
    }

    return false;
  }
}
