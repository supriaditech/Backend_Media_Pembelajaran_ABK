import { IsInt, IsString, IsEnum } from 'class-validator';

export enum ProgressStatus {
  PENDING = 'PENDING',
  UNDERSTOOD = 'UNDERSTOOD',
}

export class StudentAiRequestDto {
  @IsString()
  nama: string;

  @IsInt()
  videoPlayCount: number;

  @IsEnum(ProgressStatus)
  status: ProgressStatus;

  @IsString()
  nama_sub_materi: string;

  @IsString()
  description: string;
}
