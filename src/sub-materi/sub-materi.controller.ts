import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubMateriService } from './sub-materi.service';
import { UpdateSubMateriDto } from './dto/UpdateSubMateriDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path'; // Pastikan ini diimpor dengan benar
import * as fs from 'fs';
import { buildResponse } from 'helper/buildResponse';
@Controller('sub-materi')
export class SubMateriController {
  constructor(private subMateriService: SubMateriService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = path.join(
            process.cwd(),

            'src',
            'uploads',
            'videomateri',
          ); // Menggunakan path absolut
          console.log(`Saving file to: ${dir}`);

          console.log(dir);
          // Membuat direktori jika belum ada
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const newFilename = `video-materi-${file.originalname}`;
          cb(null, newFilename);
        },
      }),
    }),
  )
  @Post('create')
  async createSubMateri(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any,
  ) {
    console.log('file', file);
    console.log('data', data); // Tambahkan log untuk memeriksa data

    if (file) {
      const newFilename = `src/uploads/videoMateri/video-materi-${file.originalname}`;
      const video_url = newFilename;
      data.video_url = video_url; // Pastikan video_url diisi
    } else {
      return buildResponse(null, 'File is required', HttpStatus.BAD_REQUEST);
    }

    return await this.subMateriService.CreateSubMateri(data);
  }

  @UseGuards(AuthGuard) // Jika ingin autentikasi
  @Post('update') // Endpoint POST untuk update SubMateri
  async updateSubMateri(@Body() data: UpdateSubMateriDto) {
    return await this.subMateriService.updateSubMateri(data);
  }

  @UseGuards(AuthGuard) // Jika ingin autentikasi
  @Post('all') // Endpoint POST untuk update SubMateri
  async getAllSubMateri() {
    return await this.subMateriService.getAllSubMateri();
  }

  @UseGuards(AuthGuard) // Jika hanya user yang terautentikasi yang boleh mengakses
  @Post('materi-id') // Route untuk get SubMateri berdasarkan materiId
  async getSubMateriByMateriId(@Body('materiId') materiId: number) {
    return await this.subMateriService.getSubMateriByMateriId(materiId);
  }

  @UseGuards(AuthGuard) // Jika hanya user yang terautentikasi yang boleh mengakses
  @Post('delete') // Route untuk get SubMateri berdasarkan materiId
  async deleteSubMateri(@Body('id') id: number) {
    return await this.subMateriService.deleteSubMateri(id);
  }

  @UseGuards(AuthGuard) // Jika hanya user yang terautentikasi yang boleh mengakses
  @Post('get-submateri-by-id')
  async getSubMateriBySubMateriId(@Body('submateriId') materiId: number) {
    try {
      const result =
        await this.subMateriService.getSubMateriBySubMateriId(materiId);
      return result;
    } catch (error) {
      throw new HttpException(
        error.response || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
