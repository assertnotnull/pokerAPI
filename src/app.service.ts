import { Injectable } from '@nestjs/common';
import { rank } from './app.schema';

type HandValue = {
  hand: string[];
  ranks: Map<string, number>;
  suits: Map<string, number>;
  isFlush: boolean;
  isStraight: boolean;
  score: number;
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Call POST /hands and pass arrays of 5 cards: [[TH 9C 8D 7S 6C], [2S 3S 4S 5S 6S]]].';
  }

  evaluateHands(hands: string[][]) {
    if (hands.length == 1) {
      return hands[0].join(' ');
    }

    const handValues: HandValue[] = [];
    const uniqueCards = new Map<string, string[]>();

    for (let i = 0; i < hands.length; i++) {
      const hand = hands[i].sort(
        (a, b) => rank.indexOf(a[0]) - rank.indexOf(b[0]),
      );
      const ranks = new Map<string, number>();
      const suits = new Map<string, number>();
      let isFlush = true;
      for (let j = 0; j < hand.length; j++) {
        const [currentRank, currentSuit] = hand[j];
        if (uniqueCards.has(hand[j])) {
          return `duplicate card ${hand[j]} in ${hand} and ${uniqueCards.get(
            hand[j],
          )}}`;
        }
        uniqueCards.set(hand[j], hand);
        ranks.set(currentRank, (ranks.get(currentRank) || 0) + 1);
        suits.set(currentSuit, (suits.get(currentSuit) || 0) + 1);

        if (
          j <= 3 &&
          isFlush &&
          rank.indexOf(currentRank) + 1 != rank.indexOf(hand[j + 1][0])
        ) {
          isFlush = false;
        }
      }

      const handValue = this.setScore({
        hand,
        ranks,
        suits,
        isFlush,
        isStraight: suits.size === 1,
        score: 0,
      });
      handValues.push(handValue);
    }

    this.sortByScoreAndTopCard(handValues);
    return this.evaluateTop2Hands(handValues);
  }

  private sortByScoreAndTopCard(handValues: HandValue[]) {
    handValues.sort((a, b) => {
      const sorted = b.score - a.score;
      if (sorted == 0) {
        return rank.indexOf(a.hand[0][0]) - rank.indexOf(b.hand[0][0]);
      }
      return sorted;
    });
  }

  private evaluateTop2Hands(handValues: HandValue[]) {
    if (
      handValues[0].score === handValues[1].score &&
      handValues[0].hand[0] === handValues[1].hand[0]
    ) {
      return `tie for hands ${handValues[0].hand.join(
        ' ',
      )} and ${handValues[1].hand.join(' ')}`;
    }
    return handValues[0].hand.join(' ');
  }

  private setScore(hand: HandValue) {
    let score = 0;
    if (hand.isStraight) {
      score += 6;
    }
    if (hand.isFlush) {
      score += 7;
    }
    for (const count of hand.ranks.values()) {
      if (count === 4) {
        hand.score = 11;
        return hand;
      }
      if (count === 3) {
        if (score == 0) {
          score += 5;
        } else {
          score += 8; //full house , when pair is first add 8 to make it 10
        }
      }
      if (count === 2) {
        if (score == 0 || score == 2) {
          //one pair or two pair
          score += 2;
        } else {
          score += 5; //full house, when 3 of a kind is first add 5 to make it 10
        }
      }
    }
    hand.score = score;
    return hand;
  }
}
