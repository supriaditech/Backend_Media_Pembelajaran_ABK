import { Module } from '@nestjs/common';
import { SubMateriService } from './sub-materi.service';
import { SubMateriController } from './sub-materi.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [SubMateriService],
  controllers: [SubMateriController],
  imports: [PrismaModule],
})
export class SubMateriModule {}
