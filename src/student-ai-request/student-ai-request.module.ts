import { Module } from '@nestjs/common';
import { StudentAiRequestController } from './student-ai-request.controller';
import { StudentAiRequestService } from './student-ai-request.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StudentAiRequestController],
  providers: [StudentAiRequestService],
  imports: [PrismaModule],
})
export class StudentAiRequestModule {}
