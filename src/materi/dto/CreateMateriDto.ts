import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMateriDto {
  @IsOptional() // `id` opsional
  @IsInt() // Validasi id sebagai integer
  id?: number;

  @IsString()
  @IsNotEmpty()
  nama_materi: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
