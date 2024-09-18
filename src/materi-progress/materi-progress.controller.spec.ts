import { Test, TestingModule } from '@nestjs/testing';
import { MateriProgressController } from './materi-progress.controller';

describe('MateriProgressController', () => {
  let controller: MateriProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MateriProgressController],
    }).compile();

    controller = module.get<MateriProgressController>(MateriProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
