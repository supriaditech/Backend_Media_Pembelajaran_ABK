import { Test, TestingModule } from '@nestjs/testing';
import { MateriService } from './materi.service';

describe('MateriService', () => {
  let service: MateriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MateriService],
    }).compile();

    service = module.get<MateriService>(MateriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
