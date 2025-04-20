import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { buildResponse } from 'helper/buildResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMateriDto } from './dto/CreateMateriDto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const allowedMimeTypes = ['image/jpeg', 'image/png'];

@Injectable()
export class MateriService {
  constructor(private prisma: PrismaService) {}

  async CreateAddMateri(data: CreateMateriDto, file: Express.Multer.File) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        buildResponse(
          null,
          'Hanya format gambar (jpeg dan png) yang diizinkan!',
          HttpStatus.BAD_REQUEST,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

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
    const uploadDir = path.join(
      process.cwd(),
      'src',
      'uploads',
      'thumbnail-materi',
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Buat folder jika belum ada
    }
    const uniqueSuffix = uuidv4(); // Membuat UUID
    const fileExtension = path.extname(file.originalname); // Mendapatkan ekstensi file
    const newFilename = `${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadDir, newFilename);

    fs.writeFileSync(filePath, file.buffer);

    const photoUrl = `src/uploads/thumbnail-materi/${newFilename}`;

    // Jika tidak ada konflik ID, buat materi baru
    const createMateri = await this.prisma.materi.create({
      data: {
        nama_materi: data.nama_materi,
        description: data.description,
        thumbnail: photoUrl,
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
    const materiList = await this.prisma.materi.findMany({
      include: {
        subMateri: true, // Menyertakan sub-materi yang terkait
      },
    });

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

  async getSubMateriByMateriId(materiId: number) {
    // Cek apakah materi dengan ID tersebut ada
    const existingMateri = await this.prisma.materi.findUnique({
      where: { id: materiId },
      include: {
        subMateri: true, // Sertakan data SubMateri terkait, meskipun kosong
      },
    });

    // Jika materi tidak ditemukan, lempar error
    if (!existingMateri) {
      throw new HttpException(
        buildResponse(null, 'Materi not found', HttpStatus.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    }

    // Cari materi berikutnya berdasarkan ID
    const nextMateri = await this.prisma.materi.findFirst({
      where: {
        id: { gt: materiId }, // Mencari materi dengan ID yang lebih besar dari materiId saat ini
      },
      select: {
        id: true, // Ambil hanya ID dari materi berikutnya
      },
      orderBy: {
        id: 'asc', // Urutkan berdasarkan ID (terkecil ke terbesar)
      },
    });

    // Kembalikan data Materi beserta SubMateri, serta nextId jika ada
    return buildResponse(
      {
        ...existingMateri,
        nextId: nextMateri ? nextMateri.id : null, // Jika ada materi berikutnya, beri ID berikutnya
      },
      'Materi beserta Sub Materi berhasil diambil',
      200,
    );
  }
}
