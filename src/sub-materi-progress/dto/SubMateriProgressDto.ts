import { IsInt, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ProgressStatus } from '@prisma/client';

export class SubMateriProgressDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  subMateriId: number;

  @IsEnum(ProgressStatus)
  @IsNotEmpty()
  status: ProgressStatus;

  @IsInt()
  @IsOptional() // Optional karena tidak selalu diperbarui
  videoPlayCount?: number;
}
