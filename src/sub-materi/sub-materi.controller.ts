import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubMateriDto } from './dto/SubMateriDto';
import { SubMateriService } from './sub-materi.service';
import { UpdateSubMateriDto } from './dto/UpdateSubMateriDto';

@Controller('sub-materi')
export class SubMateriController {
  constructor(private subMateriService: SubMateriService) {}

  @UseGuards(AuthGuard) // Pastikan hanya user yang terautentikasi bisa mengupdate
  @Post('create')
  async createSubMateri(@Body() data: SubMateriDto) {
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
}
