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

  async getAiResponeUnderstood(data: StudentAiRequestDto) {
    const promptFormatter = `Halo saya adalah ${data.nama} Saya adalah anak-anak. saat ini saya sudah memahami materi ${data.nama_sub_materi} dari hasil pembelajaran di website modiminds. saya berhasil memahami materi dengan   menonton video pembelajaran di aplikasi Modiminds selama ${data.videoPlayCount} kali, adapun materi yang saya pelajari adalah ${data.description}. saya mau kamu buatkan soal untuk anak anak 1 saja dengan tipe soal pilihan berganda dengan pilihan jawaban A, B, dan C. Jawab prompt saya ini dalam bentuk json {
      data:{
        "nama": "${data.nama}", 
        "ucapan_selamat": buar agar anak anak semnagat belajar trus.
        "petanyakan: yang sesuai dengan ${data.description},
        "option1"
        "option2"
        "option3"
        "kunci jawaban ": yang singkat saja. jawaban juga harus ada di antara option 1 atau 2 atau 3 sama persis. tujuannya adalah agar nanti saat sistem saya bangun saya bisa tampilkan 3 option itu dan di pilih siswa dan di bandingkan dengan jawaban nya ,
        "penjelasan_jawaban": 
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
              content: promptFormatter,
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

  async getRequestQuestion(prompt: string) {
    // Pastikan prompt adalah string
    if (typeof prompt !== 'string') {
      prompt = JSON.stringify(prompt);
    }

    const promptString = `${prompt}. `;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: promptString,
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

      // Cek apakah respons adalah string yang valid
      let parsedResponse;
      try {
        // Jika respons dalam format JSON, parse
        parsedResponse = JSON.parse(aiResponse);
      } catch (e) {
        // Jika tidak bisa diparse, anggap sebagai string biasa
        console.warn(
          'Failed to parse AI response, returning as plain text:',
          aiResponse,
        );
        parsedResponse = { indonesia: aiResponse }; // Simpan sebagai string biasa
      }

      // Validasi struktur JSON
      if (!parsedResponse.indonesia) {
        throw new HttpException(
          buildResponse(
            null,
            'Invalid response format from AI',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Jika ada versi bahasa Arab, tambahkan ke respons
      const responseData = {
        arab: parsedResponse.arab || null, // Jika ada, jika tidak null
        indonesia: parsedResponse.indonesia,
      };

      return buildResponse(responseData, 'Request successful', HttpStatus.OK);
    } catch (error) {
      console.error('Error while calling OpenAI API:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
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
