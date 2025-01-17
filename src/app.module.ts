import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MateriModule } from './materi/materi.module';
import { SubMateriModule } from './sub-materi/sub-materi.module';
import { SubMateriProgressModule } from './sub-materi-progress/sub-materi-progress.module';
import { MateriProgressModule } from './materi-progress/materi-progress.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StudentAiRequestModule } from './student-ai-request/student-ai-request.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MateriModule,
    SubMateriModule,
    SubMateriProgressModule,
    MateriProgressModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src/uploads'), // Ganti ini dengan `process.cwd()` untuk mengarah ke root proyek
      serveRoot: '/src/uploads/', // URL root untuk akses
    }),
    StudentAiRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
