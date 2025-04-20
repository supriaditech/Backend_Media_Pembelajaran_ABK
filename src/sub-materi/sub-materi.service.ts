import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubMateriDto } from './dto/SubMateriDto';
import { buildResponse } from 'helper/buildResponse';
import { UpdateSubMateriDto } from './dto/UpdateSubMateriDto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubMateriService {
  constructor(private prisma: PrismaService) {}

  async CreateSubMateri(
    data: SubMateriDto,
    videoFile: Express.Multer.File,
    thumbnailFile: Express.Multer.File,
  ) {
    const allowedVideoMimeTypes = ['video/mp4', 'video/x-matroska'];
    const allowedThumbnailMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // Validasi tipe file video
    if (!allowedVideoMimeTypes.includes(videoFile.mimetype)) {
      throw new HttpException(
        buildResponse(
          null,
          'Hanya format Video (mp4 dan mkv) yang diizinkan!',
          HttpStatus.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validasi tipe file thumbnail
    if (!allowedThumbnailMimeTypes.includes(thumbnailFile.mimetype)) {
      throw new HttpException(
        buildResponse(
          null,
          'Hanya format gambar yang diizinkan untuk thumbnail!',
          HttpStatus.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const idMateri = Number(data.materiId);
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: idMateri },
    });

    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Simpan video
    const videoUploadDir = path.join(
      process.cwd(),
      'src',
      'uploads',
      'videomateri',
    );
    if (!fs.existsSync(videoUploadDir)) {
      fs.mkdirSync(videoUploadDir, { recursive: true });
    }
    const videoUniqueSuffix = uuidv4();
    const videoExtension = path.extname(videoFile.originalname);
    const videoFilename = `${videoUniqueSuffix}${videoExtension}`;
    const videoFilePath = path.join(videoUploadDir, videoFilename);
    fs.writeFileSync(videoFilePath, videoFile.buffer);
    const videoUrl = `src/uploads/videomateri/${videoFilename}`;

    // Simpan thumbnail
    const thumbnailUploadDir = path.join(
      process.cwd(),
      'src',
      'uploads',
      'thumbnail-submateri',
    );
    if (!fs.existsSync(thumbnailUploadDir)) {
      fs.mkdirSync(thumbnailUploadDir, { recursive: true });
    }
    const thumbnailUniqueSuffix = uuidv4();
    const thumbnailExtension = path.extname(thumbnailFile.originalname);
    const thumbnailFilename = `${thumbnailUniqueSuffix}${thumbnailExtension}`;
    const thumbnailFilePath = path.join(thumbnailUploadDir, thumbnailFilename);
    fs.writeFileSync(thumbnailFilePath, thumbnailFile.buffer);
    const thumbnailUrl = `src/uploads/thumbnail-submateri/${thumbnailFilename}`;

    // Buat SubMateri baru
    const createSubMateri = await this.prisma.subMateri.create({
      data: {
        nama_sub_materi: data.nama_sub_materi,
        video_url: videoUrl,
        description: data.description,
        materiId: idMateri,
        thumbnail: thumbnailUrl,
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
        materiId: data.materiId ?? Number(existingSubMateri.materiId), // Jika materiId diubah
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
      include: {
        materi: true,
      },
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

  async getSubMateriBySubMateriId(subMateriId: number) {
    // Cek apakah submateri dengan ID tersebut ada
    const existingSubMateri = await this.prisma.subMateri.findUnique({
      where: { id: subMateriId },
    });

    // Jika submateri tidak ditemukan, lempar error
    if (!existingSubMateri) {
      throw new HttpException(
        buildResponse(null, 'Submateri not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Cari submateri berikutnya berdasarkan ID
    const nextSubMateri = await this.prisma.subMateri.findFirst({
      where: {
        id: { gt: subMateriId }, // Mencari submateri dengan ID yang lebih besar dari subMateriId saat ini
      },
      select: {
        id: true, // Ambil hanya ID dari submateri berikutnya
      },
      orderBy: {
        id: 'asc', // Urutkan berdasarkan ID (terkecil ke terbesar)
      },
    });

    // Kembalikan data Submateri, serta nextSubMateriId jika ada
    return buildResponse(
      {
        ...existingSubMateri,
        nextSubMateriId: nextSubMateri ? nextSubMateri.id : null, // Jika ada submateri berikutnya, beri ID berikutnya
      },
      'Submateri berhasil diambil',
      200,
    );
  }
}
