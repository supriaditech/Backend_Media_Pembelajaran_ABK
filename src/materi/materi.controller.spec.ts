import { Test, TestingModule } from '@nestjs/testing';
import { MateriController } from './materi.controller';

describe('MateriController', () => {
  let controller: MateriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MateriController],
    }).compile();

    controller = module.get<MateriController>(MateriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
