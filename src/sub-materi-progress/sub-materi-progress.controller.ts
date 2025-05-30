import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubMateriProgressService } from './sub-materi-progress.service';
import { SubMateriProgressDto } from './dto/SubMateriProgressDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('sub-materi-progress')
export class SubMateriProgressController {
  constructor(
    private readonly subMateriProgressService: SubMateriProgressService,
  ) {}

  // Endpoint untuk membuat atau memperbarui progress sub materi
  @UseGuards(AuthGuard)
  @Post('create-or-update')
  async createOrUpdateProgress(@Body() data: SubMateriProgressDto) {
    return await this.subMateriProgressService.createOrUpdateProgress(data);
  }

  // Endpoint untuk mendapatkan progress berdasarkan userId dan materiId
  @UseGuards(AuthGuard)
  @Post('user-materi')
  async getProgressByUserAndMateri(
    @Body('userId') userId: number,
    @Body('materiId') materiId: number,
  ) {
    return await this.subMateriProgressService.getProgressByUserAndMateri(
      userId,
      materiId,
    );
  }

  // Endpoint untuk mendapatkan semua progress
  @UseGuards(AuthGuard)
  @Post('all')
  async getAllProgress() {
    return await this.subMateriProgressService.getAllProgress();
  }
  @UseGuards(AuthGuard)
  @Post('user-sub-materi')
  async getProgressByUserAndSubMateri(
    @Body('userId') userId: number,
    @Body('subMateriId') subMateriId: number,
  ) {
    return await this.subMateriProgressService.getProgressByUserAndSubMateri(
      userId,
      subMateriId,
    );
  }

  // Endpoint untuk mendapatkan semua progress berdasarkan subMateriId
  @UseGuards(AuthGuard)
  @Post('sub-materi')
  async getProgressBySubMateri(@Body('subMateriId') subMateriId: number) {
    return await this.subMateriProgressService.getProgressBySubMateri(
      subMateriId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteProgress(@Body('id') id: number) {
    return await this.subMateriProgressService.deleteSubMateriProgress(id);
  }
}
