import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MateriModule } from './materi/materi.module';
import { SubMateriModule } from './sub-materi/sub-materi.module';
import { SubMateriProgressModule } from './sub-materi-progress/sub-materi-progress.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, MateriModule, SubMateriModule, SubMateriProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
