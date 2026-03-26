export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"] as const;

export type Rank = (typeof RANKS)[number];
export type LineKey = "top" | "middle" | "bottom";
export type TopCategory = "highCard" | "onePair" | "threeOfAKind";
export type FiveCardCategory =
  | "highCard"
  | "onePair"
  | "twoPair"
  | "threeOfAKind"
  | "straight"
  | "flush"
  | "fullHouse"
  | "fourOfAKind"
  | "straightFlush"
  | "royalFlush";

export type TopLineInput = {
  category: TopCategory;
  primaryRank: Rank;
};

export type FiveCardLineInput = {
  category: FiveCardCategory;
  primaryRank: Rank;
};

export type PlayerInput = {
  id: string;
  name: string;
  top: TopLineInput;
  middle: FiveCardLineInput;
  bottom: FiveCardLineInput;
};

export type MatchInput = {
  players: PlayerInput[];
};

type Category = TopCategory | FiveCardCategory;

type EvaluatedHand = {
  line: LineKey;
  handName: string;
  category: Category;
  strength: number;
  tiebreakers: number[];
  royalty: number;
  royaltyLabel: string | null;
};

type PlayerEvaluation = {
  playerId: string;
  playerName: string;
  top: EvaluatedHand;
  middle: EvaluatedHand;
  bottom: EvaluatedHand;
  royaltyTotal: number;
};

export type LineBattleResult = {
  line: LineKey;
  winnerId: string | null;
  winnerName: string | null;
  loserId: string | null;
  loserName: string | null;
  scoreSwing: number;
  leftHandName: string;
  rightHandName: string;
};

export type RoyaltyDetail = {
  line: LineKey;
  handName: string;
  point: number;
  label: string;
};

export type PairResult = {
  leftPlayerId: string;
  leftPlayerName: string;
  rightPlayerId: string;
  rightPlayerName: string;
  lineResults: LineBattleResult[];
  scoopWinnerId: string | null;
  scoopWinnerName: string | null;
  scoopPoint: number;
  leftRoyaltyDetails: RoyaltyDetail[];
  rightRoyaltyDetails: RoyaltyDetail[];
  battleDelta: number;
  scoopDelta: number;
  royaltyDelta: number;
  totalDelta: number;
  payment: {
    fromId: string;
    fromName: string;
    toId: string;
    toName: string;
    point: number;
  } | null;
};

export type PlayerSummary = {
  playerId: string;
  playerName: string;
  battlePoint: number;
  scoopPoint: number;
  royaltyPoint: number;
  totalPoint: number;
};

export type MatchResult = {
  summaries: PlayerSummary[];
  pairResults: PairResult[];
  payments: Array<{
    fromId: string;
    fromName: string;
    toId: string;
    toName: string;
    point: number;
  }>;
};

export const LINE_LABELS: Record<LineKey, string> = {
  top: "トップ",
  middle: "ミドル",
  bottom: "ボトム",
};

const HAND_NAME_JA: Record<Category, string> = {
  highCard: "ハイカード",
  onePair: "ワンペア",
  twoPair: "ツーペア",
  threeOfAKind: "スリーカード",
  straight: "ストレート",
  flush: "フラッシュ",
  fullHouse: "フルハウス",
  fourOfAKind: "フォーカード",
  straightFlush: "ストレートフラッシュ",
  royalFlush: "ロイヤルストレートフラッシュ",
};

const RANK_VALUE: Record<Rank, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const TOP_STRENGTH: Record<TopCategory, number> = {
  highCard: 0,
  onePair: 1,
  threeOfAKind: 3,
};

const FIVE_CARD_STRENGTH: Record<FiveCardCategory, number> = {
  highCard: 0,
  onePair: 1,
  twoPair: 2,
  threeOfAKind: 3,
  straight: 4,
  flush: 5,
  fullHouse: 6,
  fourOfAKind: 7,
  straightFlush: 8,
  royalFlush: 9,
};

export const TOP_CATEGORY_OPTIONS: Array<{ value: TopCategory; label: string }> = [
  { value: "highCard", label: "ハイカード" },
  { value: "onePair", label: "ワンペア" },
  { value: "threeOfAKind", label: "スリーカード" },
];

export const FIVE_CARD_CATEGORY_OPTIONS: Array<{ value: FiveCardCategory; label: string }> = [
  { value: "highCard", label: "ハイカード" },
  { value: "onePair", label: "ワンペア" },
  { value: "twoPair", label: "ツーペア" },
  { value: "threeOfAKind", label: "スリーカード" },
  { value: "straight", label: "ストレート" },
  { value: "flush", label: "フラッシュ" },
  { value: "fullHouse", label: "フルハウス" },
  { value: "fourOfAKind", label: "フォーカード" },
  { value: "straightFlush", label: "ストレートフラッシュ" },
  { value: "royalFlush", label: "ロイヤルストレートフラッシュ" },
];

export const getLineLabel = (line: LineKey) => LINE_LABELS[line];

export const getRankLabel = (rank: Rank) => rank;

export const getPrimaryRankLabel = (line: LineKey, category: Category, rank: Rank) => {
  if (line === "top") {
    if (category === "onePair") {
      return `${rank}のワンペア`;
    }
    if (category === "threeOfAKind") {
      return `${rank}のスリーカード`;
    }
    return `${rank}ハイ`;
  }

  if (category === "royalFlush") {
    return "ロイヤルストレートフラッシュ";
  }
  if (category === "straight" || category === "straightFlush") {
    return `${rank}ハイ${HAND_NAME_JA[category]}`;
  }
  if (category === "onePair") {
    return `${rank}のワンペア`;
  }
  if (category === "twoPair") {
    return `${rank}トップのツーペア`;
  }
  if (category === "threeOfAKind") {
    return `${rank}のスリーカード`;
  }
  if (category === "fullHouse") {
    return `${rank}のフルハウス`;
  }
  if (category === "fourOfAKind") {
    return `${rank}のフォーカード`;
  }
  if (category === "flush" || category === "highCard") {
    return `${rank}ハイ${HAND_NAME_JA[category]}`;
  }
  return HAND_NAME_JA[category];
};

const getRoyalty = (line: LineKey, category: Category, primaryValue: number) => {
  if (line === "bottom") {
    switch (category) {
      case "straight":
        return 2;
      case "flush":
        return 4;
      case "fullHouse":
        return 6;
      case "fourOfAKind":
        return 10;
      case "straightFlush":
        return 15;
      case "royalFlush":
        return 25;
      default:
        return 0;
    }
  }

  if (line === "middle") {
    switch (category) {
      case "threeOfAKind":
        return 2;
      case "straight":
        return 4;
      case "flush":
        return 8;
      case "fullHouse":
        return 12;
      case "fourOfAKind":
        return 20;
      case "straightFlush":
        return 30;
      case "royalFlush":
        return 50;
      default:
        return 0;
    }
  }

  if (category === "onePair" && primaryValue >= 6) {
    return primaryValue - 5;
  }
  if (category === "threeOfAKind") {
    return primaryValue + 8;
  }
  return 0;
};

const compareArrays = (left: number[], right: number[]) => {
  const maxLength = Math.max(left.length, right.length);
  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    if (leftValue > rightValue) {
      return 1;
    }
    if (leftValue < rightValue) {
      return -1;
    }
  }
  return 0;
};

const compareHands = (left: EvaluatedHand, right: EvaluatedHand) => {
  if (left.strength > right.strength) {
    return 1;
  }
  if (left.strength < right.strength) {
    return -1;
  }
  return compareArrays(left.tiebreakers, right.tiebreakers);
};

const evaluateTopHand = (input: TopLineInput): EvaluatedHand => {
  const primaryValue = RANK_VALUE[input.primaryRank];
  const handName = getPrimaryRankLabel("top", input.category, input.primaryRank);
  return {
    line: "top",
    handName,
    category: input.category,
    strength: TOP_STRENGTH[input.category],
    tiebreakers: [primaryValue],
    royalty: getRoyalty("top", input.category, primaryValue),
    royaltyLabel: getRoyalty("top", input.category, primaryValue) > 0 ? handName : null,
  };
};

const evaluateFiveCardHand = (
  line: Exclude<LineKey, "top">,
  input: FiveCardLineInput,
): EvaluatedHand => {
  const primaryValue = input.category === "royalFlush" ? 14 : RANK_VALUE[input.primaryRank];
  const handName = getPrimaryRankLabel(line, input.category, input.primaryRank);
  return {
    line,
    handName,
    category: input.category,
    strength: FIVE_CARD_STRENGTH[input.category],
    tiebreakers: [primaryValue],
    royalty: getRoyalty(line, input.category, primaryValue),
    royaltyLabel: getRoyalty(line, input.category, primaryValue) > 0 ? handName : null,
  };
};

const toRoyaltyDetails = (evaluation: PlayerEvaluation): RoyaltyDetail[] => {
  return [evaluation.top, evaluation.middle, evaluation.bottom]
    .filter((hand) => hand.royalty > 0)
    .map((hand) => ({
      line: hand.line,
      handName: hand.handName,
      point: hand.royalty,
      label: hand.royaltyLabel ?? hand.handName,
    }));
};

const validateInput = (input: MatchInput) => {
  if (input.players.length !== 3 && input.players.length !== 4) {
    throw new Error("プレイヤー人数は3人または4人にしてください。");
  }

  for (const player of input.players) {
    if (!player.name.trim()) {
      throw new Error("プレイヤー名を入力してください。");
    }
  }
};

const evaluatePlayer = (player: PlayerInput): PlayerEvaluation => {
  const top = evaluateTopHand(player.top);
  const middle = evaluateFiveCardHand("middle", player.middle);
  const bottom = evaluateFiveCardHand("bottom", player.bottom);

  if (compareHands(bottom, middle) < 0 || compareHands(middle, top) < 0) {
    throw new Error(`${player.name} の並びが不正です。ボトム >= ミドル >= トップ になるようにしてください。`);
  }

  return {
    playerId: player.id,
    playerName: player.name,
    top,
    middle,
    bottom,
    royaltyTotal: top.royalty + middle.royalty + bottom.royalty,
  };
};

export const calculateMatchResult = (input: MatchInput): MatchResult => {
  validateInput(input);
  const evaluations = input.players.map(evaluatePlayer);

  const summaryMap = new Map<string, PlayerSummary>();
  for (const evaluation of evaluations) {
    summaryMap.set(evaluation.playerId, {
      playerId: evaluation.playerId,
      playerName: evaluation.playerName,
      battlePoint: 0,
      scoopPoint: 0,
      royaltyPoint: 0,
      totalPoint: 0,
    });
  }

  const pairResults: PairResult[] = [];
  const payments: MatchResult["payments"] = [];

  for (let leftIndex = 0; leftIndex < evaluations.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < evaluations.length; rightIndex += 1) {
      const left = evaluations[leftIndex];
      const right = evaluations[rightIndex];
      const lines: LineKey[] = ["top", "middle", "bottom"];
      let leftWins = 0;
      let rightWins = 0;
      let battleDelta = 0;

      const lineResults = lines.map((line) => {
        const leftHand = left[line];
        const rightHand = right[line];
        const comparison = compareHands(leftHand, rightHand);

        if (comparison > 0) {
          leftWins += 1;
          battleDelta += 1;
          return {
            line,
            winnerId: left.playerId,
            winnerName: left.playerName,
            loserId: right.playerId,
            loserName: right.playerName,
            scoreSwing: 1,
            leftHandName: leftHand.handName,
            rightHandName: rightHand.handName,
          };
        }
        if (comparison < 0) {
          rightWins += 1;
          battleDelta -= 1;
          return {
            line,
            winnerId: right.playerId,
            winnerName: right.playerName,
            loserId: left.playerId,
            loserName: left.playerName,
            scoreSwing: 1,
            leftHandName: leftHand.handName,
            rightHandName: rightHand.handName,
          };
        }
        return {
          line,
          winnerId: null,
          winnerName: null,
          loserId: null,
          loserName: null,
          scoreSwing: 0,
          leftHandName: leftHand.handName,
          rightHandName: rightHand.handName,
        };
      });

      let scoopWinnerId: string | null = null;
      let scoopWinnerName: string | null = null;
      let scoopDelta = 0;
      if (leftWins === 3) {
        scoopWinnerId = left.playerId;
        scoopWinnerName = left.playerName;
        scoopDelta = 3;
      } else if (rightWins === 3) {
        scoopWinnerId = right.playerId;
        scoopWinnerName = right.playerName;
        scoopDelta = -3;
      }

      const royaltyDelta = left.royaltyTotal - right.royaltyTotal;
      const totalDelta = battleDelta + scoopDelta + royaltyDelta;
      const payment =
        totalDelta === 0
          ? null
          : totalDelta > 0
            ? {
                fromId: right.playerId,
                fromName: right.playerName,
                toId: left.playerId,
                toName: left.playerName,
                point: totalDelta,
              }
            : {
                fromId: left.playerId,
                fromName: left.playerName,
                toId: right.playerId,
                toName: right.playerName,
                point: Math.abs(totalDelta),
              };

      const leftSummary = summaryMap.get(left.playerId);
      const rightSummary = summaryMap.get(right.playerId);
      if (!leftSummary || !rightSummary) {
        throw new Error("集計に失敗しました。");
      }
      leftSummary.battlePoint += battleDelta;
      rightSummary.battlePoint -= battleDelta;
      leftSummary.scoopPoint += scoopDelta;
      rightSummary.scoopPoint -= scoopDelta;
      leftSummary.royaltyPoint += royaltyDelta;
      rightSummary.royaltyPoint -= royaltyDelta;
      leftSummary.totalPoint += totalDelta;
      rightSummary.totalPoint -= totalDelta;

      if (payment) {
        payments.push(payment);
      }

      pairResults.push({
        leftPlayerId: left.playerId,
        leftPlayerName: left.playerName,
        rightPlayerId: right.playerId,
        rightPlayerName: right.playerName,
        lineResults,
        scoopWinnerId,
        scoopWinnerName,
        scoopPoint: Math.abs(scoopDelta),
        leftRoyaltyDetails: toRoyaltyDetails(left),
        rightRoyaltyDetails: toRoyaltyDetails(right),
        battleDelta,
        scoopDelta,
        royaltyDelta,
        totalDelta,
        payment,
      });
    }
  }

  const summaries = [...summaryMap.values()].sort((left, right) => right.totalPoint - left.totalPoint);
  return { summaries, pairResults, payments };
};
