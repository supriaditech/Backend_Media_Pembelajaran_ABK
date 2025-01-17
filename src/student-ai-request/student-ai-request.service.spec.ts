import { Test, TestingModule } from '@nestjs/testing';
import { StudentAiRequestService } from './student-ai-request.service';

describe('StudentAiRequestService', () => {
  let service: StudentAiRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentAiRequestService],
    }).compile();

    service = module.get<StudentAiRequestService>(StudentAiRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
