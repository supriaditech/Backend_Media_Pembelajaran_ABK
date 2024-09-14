import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubMateriDto {
  @IsString()
  @IsNotEmpty()
  nama_sub_materi: string;

  @IsString()
  @IsNotEmpty()
  video_url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  materiId: number;
}
