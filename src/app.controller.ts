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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('hands')
  evaluateHand(@Body() body: Body): string {
    try {
      const validHands = handSchema.parse(body);
      return this.appService.evaluateHands(validHands.hands);
    } catch (err) {
      throw new HttpException(
        'Invalid hands, expect hands to be an array of 5 cards: [["TH", "9C", "8D", "7S", "6C"], ["2S", "3S", "4S", "5S", "6S"]]. Where S=♠, H=♥, D=♦, C=♣',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
