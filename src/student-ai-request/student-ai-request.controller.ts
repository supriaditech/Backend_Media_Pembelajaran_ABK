import { Body, Controller, Post } from '@nestjs/common';
import { StudentAiRequestService } from './student-ai-request.service';
import { StudentAiRequestDto } from './Dto/student-ai-request.dto';

@Controller('student-ai-request')
export class StudentAiRequestController {
  constructor(
    private readonly studentAiRequestService: StudentAiRequestService,
  ) {}

  @Post('get-respone-ai-pendding')
  async getRequestAiStudentController(@Body() data: StudentAiRequestDto) {
    return await this.studentAiRequestService.getRequestAiStudent(data);
  }
  @Post('get-respone-question')
  async getRequestQuestionController(@Body() data: any) {
    return await this.studentAiRequestService.getRequestQuestion(data);
  }

  @Post('get-respone-ai-understood')
  async getRequestAiStudentUnderstoodController(
    @Body() data: StudentAiRequestDto,
  ) {
    return await this.studentAiRequestService.getAiResponeUnderstood(data);
  }
}
