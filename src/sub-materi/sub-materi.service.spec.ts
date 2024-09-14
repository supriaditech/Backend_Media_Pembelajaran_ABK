import { Test, TestingModule } from '@nestjs/testing';
import { SubMateriService } from './sub-materi.service';

describe('SubMateriService', () => {
  let service: SubMateriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubMateriService],
    }).compile();

    service = module.get<SubMateriService>(SubMateriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
