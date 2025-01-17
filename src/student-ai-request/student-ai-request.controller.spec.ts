import { Test, TestingModule } from '@nestjs/testing';
import { StudentAiRequestController } from './student-ai-request.controller';

describe('StudentAiRequestController', () => {
  let controller: StudentAiRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAiRequestController],
    }).compile();

    controller = module.get<StudentAiRequestController>(StudentAiRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
