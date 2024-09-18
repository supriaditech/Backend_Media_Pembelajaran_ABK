import { ProgressStatus } from '@prisma/client';
import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export class MateriProgressDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  materiId: number;

  @IsEnum(ProgressStatus)
  @IsNotEmpty()
  status: ProgressStatus;
}
