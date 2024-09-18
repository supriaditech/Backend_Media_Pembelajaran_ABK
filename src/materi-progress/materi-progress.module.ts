import { Module } from '@nestjs/common';
import { MateriProgressService } from './materi-progress.service';
import { MateriProgressController } from './materi-progress.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [MateriProgressService],
  controllers: [MateriProgressController],
  imports: [PrismaModule],
})
export class MateriProgressModule {}
