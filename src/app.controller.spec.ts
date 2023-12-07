import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokerHandsDto } from './pokerhands.dto';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('poker hands', () => {
    it('should return a valid hand', () => {
      const body: PokerHandsDto = {
        hands: [
          ['2H', '3D', '5S', '9C', 'KD'],
          ['2C', '3H', '4S', '8C', 'AH'],
        ],
      };
      expect(appController.evaluateHand(body)).toBe(
        AppService.sortCards(body.hands[1]).join(' '),
      );
    });

    it('should return a valid hand with one pair', () => {
      const body: PokerHandsDto = {
        hands: [
          ['2H', '2D', '5S', '9C', 'KD'],
          ['2C', '3H', '4S', '8C', 'AH'],
        ],
      };
      expect(appController.evaluateHand(body)).toBe(
        AppService.sortCards(body.hands[0]).join(' '),
      );
    }
  });
});
