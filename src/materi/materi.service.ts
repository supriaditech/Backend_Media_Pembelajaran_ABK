import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { buildResponse } from 'helper/buildResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMateriDto } from './dto/CreateMateriDto';

@Injectable()
export class MateriService {
  constructor(private prisma: PrismaService) {}

  async CreateAddMateri(data: CreateMateriDto) {
    // Jika id tidak disediakan, lewati pengecekan berdasarkan id
    if (data.id) {
      const existingMateri = await this.prisma.materi.findUnique({
        where: { id: data.id },
      });

      // Jika materi dengan ID tersebut sudah ada, lempar error
      if (existingMateri) {
        throw new HttpException(
          buildResponse(
            null,
            'Materi with this ID already exists',
            HttpStatus.CONFLICT,
          ),
          HttpStatus.CONFLICT,
        );
      }
    }

    // Jika tidak ada konflik ID, buat materi baru
    const createMateri = await this.prisma.materi.create({
      data: {
        nama_materi: data.nama_materi,
        description: data.description,
        // Tambahkan data lain yang dibutuhkan
      },
    });

    return buildResponse(createMateri, 'Materi Berhasil Dibuat', HttpStatus.OK);
  }

  // Method untuk update materi
  async updateMateri(data: CreateMateriDto) {
    // Cek apakah materi dengan ID tersebut ada
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: data.id },
    });

    // Jika tidak ada, lempar error
    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Update materi dengan data yang baru
    const updatedMateri = await this.prisma.materi.update({
      where: { id: data.id },
      data: {
        nama_materi: data.nama_materi ?? existingMateri.nama_materi, // Hanya update jika ada data baru
        description: data.description ?? existingMateri.description,
      },
    });

    return buildResponse(
      updatedMateri,
      'Materi Berhasil Diupdate',
      HttpStatus.OK,
    );
  }

  async getAllMateri() {
    const materiList = await this.prisma.materi.findMany();

    return buildResponse(materiList, 'Materi Berhasil Diambil', 200);
  }

  // Method untuk menghapus materi berdasarkan id
  async deleteMateri(id: number) {
    // Cek apakah materi dengan ID tersebut ada
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id },
    });

    // Jika materi tidak ditemukan, lempar error
    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Hapus materi jika ada
    await this.prisma.materi.delete({
      where: { id },
    });

    return buildResponse(null, 'Materi Berhasil Dihapus', HttpStatus.OK);
  }
}
