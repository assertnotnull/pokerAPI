import { z } from 'zod';

export const suit = ['S', 'H', 'D', 'C'];
export const rank = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

//a card is like 'T♠'
export const handSchema = z.object({
  hands: z
    .string()
    .refine((card) => rank.includes(card[0]) && suit.includes(card[1]))
    .array()
    .length(5)
    .array(),
});

export type Hand = z.infer<typeof handSchema>;
