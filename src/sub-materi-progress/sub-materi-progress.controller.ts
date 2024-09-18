import { Body, Controller, Post } from '@nestjs/common';
import { SubMateriProgressService } from './sub-materi-progress.service';
import { SubMateriProgressDto } from './dto/SubMateriProgressDto';

@Controller('sub-materi-progress')
export class SubMateriProgressController {
  constructor(
    private readonly subMateriProgressService: SubMateriProgressService,
  ) {}

  // Endpoint untuk membuat atau memperbarui progress sub materi
  @Post('create-or-update')
  async createOrUpdateProgress(@Body() data: SubMateriProgressDto) {
    return await this.subMateriProgressService.createOrUpdateProgress(data);
  }

  // Endpoint untuk mendapatkan progress berdasarkan userId dan materiId
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
  @Post('all')
  async getAllProgress() {
    return await this.subMateriProgressService.getAllProgress();
  }
}
