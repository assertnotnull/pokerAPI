import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('poker hands', () => {
    it('should return hand with high card', () => {
      const hands = [
        ['2H', '3D', '5S', '9C', 'KD'],
        ['2C', '3H', '4S', '8C', 'AH'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[1]).join(' '),
      );
    });

    it('should return hand with one pair', () => {
      const hands = [
        ['2H', '2D', '5S', '9C', 'KD'],
        ['2C', '3H', '4S', '8C', 'AH'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with two pair', () => {
      const hands = [
        ['2H', '2D', '4S', '4C', 'KD'],
        ['3H', '3D', '5S', '9C', 'KS'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with three of a kind', () => {
      const hands = [
        ['2H', '2D', '2S', '4C', 'KD'],
        ['3H', '3D', '5S', '5C', 'KS'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with straight', () => {
      const hands = [
        ['2H', '3D', '4S', '5S', '6D'],
        ['3H', '3S', '3C', '5C', 'KD'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with flush', () => {
      const hands = [
        ['2H', '6H', '7H', '8H', '9H'],
        ['2S', '3S', '4S', '5S', '6D'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with full house', () => {
      const hands = [
        ['2C', '2D', '2S', '4C', '4D'],
        ['2H', '6H', '7H', '8H', '9H'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with four of a kind', () => {
      const hands = [
        ['2H', '2D', '2S', '2C', '4D'],
        ['3C', '3H', '3S', '4C', '4H'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with straight flush', () => {
      const hands = [
        ['2H', '3H', '4H', '5H', '6H'],
        ['3C', '3D', '3S', '4C', '4S'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with straight flush low ace', () => {
      const hands = [
        ['AH', '2H', '3H', '4H', '5H'],
        ['3C', '3D', '3S', '4C', '4S'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return hand with straight flush high ace', () => {
      const hands = [
        ['AH', 'KH', 'QH', 'JH', 'TH'],
        ['3C', '3D', '3S', '4C', '4S'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        AppService.sortCards(hands[0]).join(' '),
      );
    });

    it('should return a message about duplicate cards', () => {
      const hands = [
        ['2H', '3H', '4H', '5H', '6H'],
        ['3C', '3H', '8H', '8C', 'AH'],
      ];
      expect(service.evaluateHands(hands)).toBe(
        'duplicate card 3H in AH,8H,8C,3C,3H and 6H,5H,4H,3H,2H',
      );
    });
  });
});
