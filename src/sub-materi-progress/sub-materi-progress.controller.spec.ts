import { Test, TestingModule } from '@nestjs/testing';
import { SubMateriProgressController } from './sub-materi-progress.controller';

describe('SubMateriProgressController', () => {
  let controller: SubMateriProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubMateriProgressController],
    }).compile();

    controller = module.get<SubMateriProgressController>(
      SubMateriProgressController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
