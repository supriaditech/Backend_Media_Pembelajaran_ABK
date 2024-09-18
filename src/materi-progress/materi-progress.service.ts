import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MateriProgressDto } from './dto/MateriProgressDto';
import { buildResponse } from 'helper/buildResponse';

@Injectable()
export class MateriProgressService {
  constructor(private prisma: PrismaService) {}

  // Create or update progress for a specific materi
  async createOrUpdateProgress(data: MateriProgressDto) {
    // Cek apakah user dan materi ada
    const [existingUser, existingMateri] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: data.userId } }),
      this.prisma.materi.findUnique({ where: { id: data.materiId } }),
    ]);

    if (!existingUser || !existingMateri) {
      throw new HttpException(
        buildResponse(null, 'User or Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Cek apakah progress sudah ada
    const existingProgress = await this.prisma.materiProgress.findFirst({
      where: {
        userId: data.userId,
        materiId: data.materiId,
      },
    });

    if (!existingProgress) {
      // Jika progress belum ada, buat progress baru
      const newProgress = await this.prisma.materiProgress.create({
        data: {
          userId: data.userId,
          materiId: data.materiId,
          status: data.status,
        },
      });

      return buildResponse(
        newProgress,
        'Materi progress successfully created',
        HttpStatus.CREATED,
      );
    } else {
      // Jika progress sudah ada, update status saja
      const updatedProgress = await this.prisma.materiProgress.update({
        where: { id: existingProgress.id },
        data: {
          status: data.status,
        },
      });

      return buildResponse(
        updatedProgress,
        'Materi progress successfully updated',
        HttpStatus.OK,
      );
    }
  }

  // Get progress by userId and materiId
  async getProgressByUserAndMateri(userId: number, materiId: number) {
    const [existingUser, existingMateri] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.materi.findUnique({ where: { id: materiId } }),
    ]);

    if (!existingUser || !existingMateri) {
      throw new HttpException(
        buildResponse(null, 'User or Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    const progress = await this.prisma.materiProgress.findFirst({
      where: {
        userId: userId,
        materiId: materiId,
      },
    });

    if (!progress) {
      throw new HttpException(
        buildResponse(null, 'Progress not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    return buildResponse(
      progress,
      'Progress retrieved successfully',
      HttpStatus.OK,
    );
  }

  async getProgressByMateri(materiId: number) {
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: materiId },
    });

    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    const progress = await this.prisma.materiProgress.findMany({
      where: {
        materiId: materiId,
      },
      include: {
        user: true, // Sertakan informasi user
      },
    });

    if (progress.length === 0) {
      throw new HttpException(
        buildResponse(
          null,
          'No progress found for this Materi',
          HttpStatus.NOT_FOUND,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return buildResponse(
      progress,
      'Progress retrieved successfully for the Materi',
      HttpStatus.OK,
    );
  }

  // Get all progress for all users and materi
  async getAllProgress() {
    const allProgress = await this.prisma.materiProgress.findMany({
      include: {
        user: true,
        materi: true,
      },
    });

    return buildResponse(
      allProgress,
      'All Materi progress retrieved successfully',
      HttpStatus.OK,
    );
  }
}
