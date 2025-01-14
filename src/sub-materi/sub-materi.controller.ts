import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubMateriService } from './sub-materi.service';
import { UpdateSubMateriDto } from './dto/UpdateSubMateriDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { buildResponse } from 'helper/buildResponse';
@Controller('sub-materi')
export class SubMateriController {
  constructor(private subMateriService: SubMateriService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async createSubMateri(
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() data: any,
  ) {
    const videoFile = files.video ? files.video[0] : null;
    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;

    if (!videoFile) {
      return buildResponse(
        null,
        'Video file is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!thumbnailFile) {
      return buildResponse(
        null,
        'Thumbnail file is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.subMateriService.CreateSubMateri(
      data,
      videoFile,
      thumbnailFile,
    );
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
