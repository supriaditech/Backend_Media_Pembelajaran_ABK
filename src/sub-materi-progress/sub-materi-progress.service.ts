import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubMateriProgressDto } from './dto/SubMateriProgressDto';
import { buildResponse } from 'helper/buildResponse';

@Injectable()
export class SubMateriProgressService {
  constructor(private prisma: PrismaService) {}

  // Method untuk membuat atau memperbarui progress sub materi
  async createOrUpdateProgress(data: SubMateriProgressDto) {
    // Cek apakah user, subMateri, dan materiProgress ada
    const existingUser = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    const existingSubMateri = await this.prisma.subMateri.findUnique({
      where: { id: data.subMateriId },
    });

    if (!existingUser || !existingSubMateri) {
      throw new HttpException(
        buildResponse(
          null,
          'User, SubMateri, atau MateriProgress tidak ditemukan',
          HttpStatus.NOT_FOUND,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    // Cek apakah progress sudah ada
    const existingProgress = await this.prisma.subMateriProgress.findFirst({
      where: {
        userId: data.userId,
        subMateriId: data.subMateriId,
      },
    });

    if (!existingProgress) {
      // Jika progress belum ada, buat progress baru
      const newProgress = await this.prisma.subMateriProgress.create({
        data: {
          userId: data.userId,
          subMateriId: data.subMateriId,
          status: data.status,
          videoPlayCount: data.videoPlayCount || 1, // Set play count ke 1 saat progress baru dibuat
        },
      });

      return buildResponse(
        newProgress,
        'Progress SubMateri berhasil dibuat',
        HttpStatus.CREATED,
      );
    } else {
      // Jika progress sudah ada, perbarui videoPlayCount dan status
      const newStatus = data.status ? 'UNDERSTOOD' : 'PENDING';

      const updatedProgress = await this.prisma.subMateriProgress.update({
        where: { id: existingProgress.id },
        data: {
          videoPlayCount: existingProgress.videoPlayCount + 1, // Tambah 1 pada jumlah putar
          status: newStatus,
        },
      });

      return buildResponse(
        updatedProgress,
        'Video Play Count dan Status berhasil diperbarui',
        HttpStatus.OK,
      );
    }
  }

  // Method untuk mendapatkan progress sub materi berdasarkan userId dan materiId
  async getProgressByUserAndMateri(userId: number, materiId: number) {
    // Cek apakah materi dan user valid
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: materiId },
    });
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingMateri || !existingUser) {
      throw new HttpException(
        buildResponse(
          null,
          'User atau Materi tidak ditemukan',
          HttpStatus.NOT_FOUND,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    // Dapatkan progress SubMateri berdasarkan userId dan materiId
    const progress = await this.prisma.subMateriProgress.findMany({
      where: {
        userId: userId,
        subMateri: {
          materiId: materiId, // Filter berdasarkan materiId di dalam subMateri
        },
      },
      include: {
        subMateri: true, // Sertakan informasi sub materi
      },
    });

    if (progress.length === 0) {
      throw new HttpException(
        buildResponse(null, 'Progress tidak ditemukan', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    return buildResponse(progress, 'Progress berhasil diambil', HttpStatus.OK);
  }

  // Method untuk mendapatkan semua progress sub materi
  async getAllProgress() {
    const allProgress = await this.prisma.subMateriProgress.findMany({
      include: {
        user: true, // Sertakan informasi user
        subMateri: true, // Sertakan informasi sub materi
      },
    });

    return buildResponse(
      allProgress,
      'Semua Progress SubMateri berhasil diambil',
      HttpStatus.OK,
    );
  }
}
