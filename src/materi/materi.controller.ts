import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MateriService } from './materi.service';
import { CreateMateriDto } from './dto/CreateMateriDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('materi')
export class MateriController {
  constructor(private materiService: MateriService) {}

  @UseGuards(AuthGuard) // Pastikan hanya user yang terautentikasi bisa mengupdate
  @Post('create')
  async createMateri(@Body() data: CreateMateriDto) {
    return await this.materiService.CreateAddMateri(data);
  }

  @UseGuards(AuthGuard) // Pastikan hanya user yang terautentikasi bisa mengupdate
  @Post('update') // Menggunakan POST untuk update
  async updateMateri(@Body() data: CreateMateriDto) {
    return await this.materiService.updateMateri(data);
  }

  @UseGuards(AuthGuard) // Jika hanya user yang terautentikasi boleh mengakses
  @Post('all') // Route untuk get all materi
  async getAllMateri() {
    return await this.materiService.getAllMateri();
  }

  @UseGuards(AuthGuard) // Gunakan guard jika hanya user yang terautentikasi yang bisa delete
  @Post('delete') // Menggunakan DELETE dan mengambil id dari parameter URL
  async deleteMateri(@Body('id') id: number) {
    return await this.materiService.deleteMateri(id);
  }

  @UseGuards(AuthGuard) // Jika hanya user yang terautentikasi yang boleh mengakses
  @Post('get-materi-submateri')
  async getSubMateriByMateriId(@Body('materiId') materiId: number) {
    try {
      const result = await this.materiService.getSubMateriByMateriId(materiId);
      return result;
    } catch (error) {
      throw new HttpException(
        error.response || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
