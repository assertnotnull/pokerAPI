import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { handSchema } from './app.schema';
import { PokerHandsDto } from './pokerhands.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('hands')
  evaluateHand(@Body() body: PokerHandsDto): string {
    const outcome = handSchema.safeParse(body);
    if (outcome.success) {
      return this.appService.evaluateHands(outcome.data.hands);
    }

    throw new HttpException(
      'Invalid hands, expect hands to be an array of 5 cards: [["TH", "9C", "8D", "7S", "6C"], ["2S", "3S", "4S", "5S", "6S"]]. Where S=♠, H=♥, D=♦, C=♣',
      HttpStatus.BAD_REQUEST,
    );
  }
}
