import { Module } from '@nestjs/common';
import { SubMateriProgressService } from './sub-materi-progress.service';
import { SubMateriProgressController } from './sub-materi-progress.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SubMateriProgressService],
  controllers: [SubMateriProgressController],
  imports: [PrismaModule],
})
export class SubMateriProgressModule {}
