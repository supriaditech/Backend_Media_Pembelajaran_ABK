import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSubMateriDto {
  @IsNumber()
  @IsNotEmpty()
  id: number; // ID untuk menentukan SubMateri yang akan diupdate

  @IsString()
  @IsOptional()
  nama_sub_materi?: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional() // Bisa opsional saat update
  materiId?: number;
}
