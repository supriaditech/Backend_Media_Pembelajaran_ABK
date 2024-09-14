import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubMateriDto } from './dto/SubMateriDto';
import { buildResponse } from 'helper/buildResponse';
import { UpdateSubMateriDto } from './dto/UpdateSubMateriDto';

@Injectable()
export class SubMateriService {
  constructor(private prisma: PrismaService) {}

  async CreateSubMateri(data: SubMateriDto) {
    // Cek apakah materi dengan ID yang diberikan ada di database
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: data.materiId },
    });

    // Jika tidak ditemukan, lempar error
    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Jika materi ditemukan, buat SubMateri baru
    const createSubMateri = await this.prisma.subMateri.create({
      data: {
        nama_sub_materi: data.nama_sub_materi,
        video_url: data.video_url,
        description: data.description,
        materiId: data.materiId, // Relasi ke Materi
      },
    });

    return buildResponse(
      createSubMateri,
      'SubMateri Berhasil Dibuat',
      HttpStatus.OK,
    );
  }

  async updateSubMateri(data: UpdateSubMateriDto) {
    // Cek apakah SubMateri dengan ID yang diberikan ada di database
    const existingSubMateri = await this.prisma.subMateri.findUnique({
      where: { id: data.id },
    });

    // Jika SubMateri tidak ditemukan, lempar error
    if (!existingSubMateri) {
      throw new HttpException(
        buildResponse(null, 'SubMateri not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Jika SubMateri ditemukan, update data
    const updatedSubMateri = await this.prisma.subMateri.update({
      where: { id: data.id },
      data: {
        nama_sub_materi:
          data.nama_sub_materi ?? existingSubMateri.nama_sub_materi,
        video_url: data.video_url ?? existingSubMateri.video_url,
        description: data.description ?? existingSubMateri.description,
        materiId: data.materiId ?? existingSubMateri.materiId, // Jika materiId diubah
      },
    });

    return buildResponse(
      updatedSubMateri,
      'SubMateri Berhasil Diupdate',
      HttpStatus.OK,
    );
  }

  async getAllSubMateri() {
    const subMateri = await this.prisma.subMateri.findMany();

    return buildResponse(subMateri, 'Sub Materi Berhasil Diambil', 200);
  }

  // Method untuk mendapatkan SubMateri berdasarkan materiId
  async getSubMateriByMateriId(materiId: number) {
    // Cek apakah materi dengan ID tersebut ada
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: materiId },
    });

    // Jika materi tidak ditemukan, lempar error
    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Cari SubMateri berdasarkan materiId
    const subMateri = await this.prisma.subMateri.findMany({
      where: { materiId },
    });

    return buildResponse(subMateri, 'Sub Materi Berhasil Diambil', 200);
  }

  async deleteSubMateri(id: number) {
    // Cek apakah SubMateri dengan ID yang diberikan ada di database
    const existingSubMateri = await this.prisma.subMateri.findUnique({
      where: { id: id },
    });

    // Jika SubMateri tidak ditemukan, lempar error
    if (!existingSubMateri) {
      throw new HttpException(
        buildResponse(null, 'SubMateri not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Jika SubMateri ditemukan, update data
    const updatedSubMateri = await this.prisma.subMateri.delete({
      where: { id: id },
    });

    return buildResponse(
      updatedSubMateri,
      'SubMateri Berhasil dihapus',
      HttpStatus.OK,
    );
  }
}
