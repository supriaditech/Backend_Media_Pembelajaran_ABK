import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentAiRequestDto } from './Dto/student-ai-request.dto';
import axios from 'axios';
import { buildResponse } from 'helper/buildResponse';

@Injectable()
export class StudentAiRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async getRequestAiStudent(data: StudentAiRequestDto) {
    const prompt = `Halo saya adalah ${data.nama}. Saya adalah anak-anak. Saya sedang belajar materi ${data.nama_sub_materi}. Saya sudah menonton video pembelajaran di aplikasi Modiminds selama ${data.videoPlayCount} kali, namun saya masih belum paham. Ini adalah deskripsi materi yang saya pelajari: ${data.description}. Sekarang beri saya saran dan juga materi berdasarkan data yang saya berikan. Tolong jawab dengan bahasa Indonesia dan dalam gaya bahasa untuk anak-anak. Saya mau kamu memberi respon sesuai struktur JSON berikut ini:   
    {  
      "data": {  
        "nama": "${data.nama}",  
        "materiTambahan": buatkan materi singkat seputar dengan contoh yang lebih sederhana dan mudah di mengeri anak anak,  
        "saran": ""  
      }  
    }`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OpenAI_Token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const aiResponse = response.data.choices[0].message.content;
      const parsedResponse = JSON.parse(aiResponse);

      return buildResponse(
        parsedResponse,
        'Request successfull',
        HttpStatus.OK,
      );
      // Simpan respon ke database
    } catch (error) {
      console.error('Error while calling OpenAI API:', error);
      throw new HttpException(
        buildResponse(
          null,
          'Failed to get response from AI',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
