import { ApiProperty } from '@nestjs/swagger';

export class PokerHandsDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'array', items: { type: 'string' } },
  })
  hands: string[][];
}
