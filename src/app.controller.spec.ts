import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the default message', () => {
      expect(appController.getHello()).toBe(
        'Call POST /hands and pass arrays of 5 cards: [["TH", "9C", "8D", "7S", "6C"], ["2S", "3S", "4S", "5S", "6S"]].',
      );
    });
  });
  describe('poker hands', () => {
    it('should return "Black wins. - with high card: 9"', () => {
      const body = {
        hands: [
          ['2H', '3D', '5S', '9C', 'KD'],
          ['2C', '3H', '4S', '8C', 'AH'],
        ],
      };
      expect(appController.evaluateHand(body as unknown as Body)).toBe(
        AppService.sortCards(body.hands[1]).join(' '),
      );
    });
  });
});
