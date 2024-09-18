import { Body, Controller, Post } from '@nestjs/common';
import { MateriProgressService } from './materi-progress.service';
import { MateriProgressDto } from './dto/MateriProgressDto';

@Controller('materi-progress')
export class MateriProgressController {
  constructor(private readonly materiProgressService: MateriProgressService) {}

  // Endpoint untuk membuat atau memperbarui progress materi
  @Post('create-or-update')
  async createOrUpdateProgress(@Body() data: MateriProgressDto) {
    return await this.materiProgressService.createOrUpdateProgress(data);
  }

  // Endpoint untuk mendapatkan semua progress berdasarkan materiId
  @Post('materi')
  async getProgressByMateri(@Body('materiId') materiId: number) {
    return await this.materiProgressService.getProgressByMateri(materiId);
  }

  // Endpoint untuk mendapatkan progress berdasarkan userId dan materiId
  @Post('user-materi')
  async getProgressByUserAndMateri(
    @Body('userId') userId: number,
    @Body('materiId') materiId: number,
  ) {
    return await this.materiProgressService.getProgressByUserAndMateri(
      userId,
      materiId,
    );
  }

  // Endpoint untuk mendapatkan semua progress
  @Post('all')
  async getAllProgress() {
    return await this.materiProgressService.getAllProgress();
  }
}
