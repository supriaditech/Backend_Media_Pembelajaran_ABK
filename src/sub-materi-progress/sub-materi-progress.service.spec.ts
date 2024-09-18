import { Test, TestingModule } from '@nestjs/testing';
import { SubMateriProgressService } from './sub-materi-progress.service';

describe('SubMateriProgressService', () => {
  let service: SubMateriProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubMateriProgressService],
    }).compile();

    service = module.get<SubMateriProgressService>(SubMateriProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
