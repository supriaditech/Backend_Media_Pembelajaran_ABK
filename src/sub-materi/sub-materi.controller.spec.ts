import { Test, TestingModule } from '@nestjs/testing';
import { SubMateriController } from './sub-materi.controller';

describe('SubMateriController', () => {
  let controller: SubMateriController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubMateriController],
    }).compile();

    controller = module.get<SubMateriController>(SubMateriController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
