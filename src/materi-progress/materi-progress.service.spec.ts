import { Test, TestingModule } from '@nestjs/testing';
import { MateriProgressService } from './materi-progress.service';

describe('MateriProgressService', () => {
  let service: MateriProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MateriProgressService],
    }).compile();

    service = module.get<MateriProgressService>(MateriProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
