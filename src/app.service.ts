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

const lowStraight = ['A', '2', '3', '4', '5'];

@Injectable()
export class AppService {
  static sortCards(cards: string[]) {
    return cards.sort((a, b) => rank.indexOf(a[0]) - rank.indexOf(b[0]));
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
      let isStraight = true;
      for (let j = 0; j < hand.length; j++) {
        const [currentRank, currentSuit] = hand[j];
        if (uniqueCards.has(hand[j])) {
          return `duplicate card ${hand[j]} in ${hand} and ${uniqueCards.get(
            hand[j],
          )}`;
        }
        uniqueCards.set(hand[j], hand);
        ranks.set(currentRank, (ranks.get(currentRank) || 0) + 1);
        suits.set(currentSuit, (suits.get(currentSuit) || 0) + 1);

        if (
          j <= 3 &&
          isStraight &&
          rank.indexOf(currentRank) + 1 != rank.indexOf(hand[j + 1][0])
        ) {
          isStraight = false;
        }
      }

      const handValue = this.setScore({
        hand,
        ranks,
        suits,
        isFlush: suits.size === 1,
        isStraight,
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

  private evaluateTop2Hands([first, second]: HandValue[]) {
    if (first.score === second.score && first.hand[0] === second.hand[0]) {
      return `tie for hands ${first.hand.join(' ')} and ${second.hand.join(
        ' ',
      )}`;
    }
    return first.hand.join(' ');
  }

  private setScore(hand: HandValue) {
    let score = 0;
    if (
      [...hand.ranks.keys()].every((r) => lowStraight.includes(r)) &&
      hand.suits.size == 1
    ) {
      score = 12;
    }
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
        if (score === 0 || score === 2) {
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
