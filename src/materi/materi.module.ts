import { Module } from '@nestjs/common';
import { MateriService } from './materi.service';
import { MateriController } from './materi.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [MateriService],
  controllers: [MateriController],
  imports: [PrismaModule],
})
export class MateriModule {}
