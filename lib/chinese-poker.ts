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

type Category = TopCategory | FiveCardCategory;

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
  isFoul: boolean;
  top: TopLineInput;
  middle: FiveCardLineInput;
  bottom: FiveCardLineInput;
};

export type MatchInput = {
  players: PlayerInput[];
};

type EvaluatedHand = {
  line: LineKey;
  handName: string;
  category: Category;
  strength: number;
  primaryValue: number;
  royalty: number;
  royaltyLabel: string | null;
};

type PlayerEvaluation = {
  playerId: string;
  playerName: string;
  isFoul: boolean;
  top: EvaluatedHand;
  middle: EvaluatedHand;
  bottom: EvaluatedHand;
  royaltyTotal: number;
};

export type ManualDecisionWinner = "left" | "right" | "tie";

export type ManualDecisionRequest = {
  id: string;
  leftPlayerId: string;
  leftPlayerName: string;
  rightPlayerId: string;
  rightPlayerName: string;
  line: LineKey;
  leftHandName: string;
  rightHandName: string;
};

export type ManualDecisionMap = Record<string, ManualDecisionWinner>;

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

const rankLabel = (rank: Rank) => rank;
const toRankValue = (rank: Rank) => RANK_VALUE[rank];
export const getLineLabel = (line: LineKey) => LINE_LABELS[line];
export const getCompactLineLabel = (line: LineKey) =>
  line === "top" ? "トップ" : line === "middle" ? "ミドル" : "ボトム";

export const createTopLineInput = (
  category: TopCategory = "highCard",
  primaryRank: Rank = "A",
): TopLineInput => ({
  category,
  primaryRank,
});

export const createFiveCardLineInput = (
  category: FiveCardCategory = "highCard",
  primaryRank: Rank = "A",
): FiveCardLineInput => ({
  category,
  primaryRank,
});

export const getLineSummary = (
  line: LineKey,
  input: TopLineInput | FiveCardLineInput,
) => {
  if (line === "top") {
    if (input.category === "highCard") {
      return `${rankLabel(input.primaryRank)}ハイ`;
    }
    if (input.category === "onePair") {
      return `${rankLabel(input.primaryRank)}のワンペア`;
    }
    return `${rankLabel(input.primaryRank)}のスリーカード`;
  }

  switch (input.category) {
    case "highCard":
      return `${rankLabel(input.primaryRank)}ハイ`;
    case "onePair":
      return `${rankLabel(input.primaryRank)}のワンペア`;
    case "twoPair":
      return `${rankLabel(input.primaryRank)}トップのツーペア`;
    case "threeOfAKind":
      return `${rankLabel(input.primaryRank)}のスリーカード`;
    case "straight":
    case "straightFlush":
      return `${rankLabel(input.primaryRank)}ハイ${HAND_NAME_JA[input.category]}`;
    case "flush":
      return `${rankLabel(input.primaryRank)}ハイフラッシュ`;
    case "fullHouse":
      return `${rankLabel(input.primaryRank)}のフルハウス`;
    case "fourOfAKind":
      return `${rankLabel(input.primaryRank)}のフォーカード`;
    case "royalFlush":
      return HAND_NAME_JA[input.category];
  }
};

export const getCompactHandLabel = (handName: string) => {
  if (handName === "ロイヤルストレートフラッシュ") {
    return "RF";
  }

  const match = handName.match(/^([2-9TJQKA])(?:トップ)?(?:の)?(.+)$/);
  if (match) {
    const rank = match[1];
    const originalRest = match[2];
    const rest = originalRest
      .replace("ストレートフラッシュ", "SF")
      .replace("フォーカード", "4カード")
      .replace("フルハウス", "フル")
      .replace("フラッシュ", "フラ")
      .replace("ストレート", "スト")
      .replace("スリーカード", "3カード")
      .replace("ツーペア", "2ペア")
      .replace("ワンペア", "1ペア")
      .replace("ハイ", originalRest === "ハイ" ? "ハイ" : "");
    return `${rank} ${rest}`.trim();
  }

  return handName
    .replace("ストレートフラッシュ", "SF")
    .replace("フォーカード", "4カード")
    .replace("フルハウス", "フル")
    .replace("フラッシュ", "フラ")
    .replace("ストレート", "スト")
    .replace("スリーカード", "3カード")
    .replace("ツーペア", "2ペア")
    .replace("ワンペア", "1ペア")
    .replace("ハイカード", "ハイ");
};

export const getCompactHandParts = (handName: string) => {
  const normalized = getCompactHandLabel(handName);
  const parts = normalized.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return {
      rank: null,
      label: parts[0],
    };
  }

  const [rank, ...rest] = parts;
  return {
    rank,
    label: rest.join(" "),
  };
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

const isComparisonAmbiguous = (line: LineKey, category: Category) => {
  if (line === "top") {
    return category === "highCard" || category === "onePair";
  }

  return (
    category === "highCard" ||
    category === "onePair" ||
    category === "twoPair" ||
    category === "threeOfAKind" ||
    category === "flush" ||
    category === "fullHouse" ||
    category === "fourOfAKind"
  );
};

const evaluateTopHand = (input: TopLineInput): EvaluatedHand => {
  const primaryValue = toRankValue(input.primaryRank);
  const handName = getLineSummary("top", input);
  const royalty = getRoyalty("top", input.category, primaryValue);
  return {
    line: "top",
    handName,
    category: input.category,
    strength: TOP_STRENGTH[input.category],
    primaryValue,
    royalty,
    royaltyLabel: royalty > 0 ? handName : null,
  };
};

const evaluateFiveCardHand = (
  line: Exclude<LineKey, "top">,
  input: FiveCardLineInput,
): EvaluatedHand => {
  const primaryValue = input.category === "royalFlush" ? 14 : toRankValue(input.primaryRank);
  const handName = getLineSummary(line, input);
  const royalty = getRoyalty(line, input.category, primaryValue);
  return {
    line,
    handName,
    category: input.category,
    strength: FIVE_CARD_STRENGTH[input.category],
    primaryValue,
    royalty,
    royaltyLabel: royalty > 0 ? handName : null,
  };
};

const compareHandsForOrdering = (left: EvaluatedHand, right: EvaluatedHand) => {
  if (left.strength !== right.strength) {
    return left.strength - right.strength;
  }
  return left.primaryValue - right.primaryValue;
};

const evaluatePlayer = (player: PlayerInput): PlayerEvaluation => {
  if (player.isFoul) {
    const foulHand: EvaluatedHand = {
      line: "top",
      handName: "ファウル",
      category: "highCard",
      strength: -1,
      primaryValue: -1,
      royalty: 0,
      royaltyLabel: null,
    };

    return {
      playerId: player.id,
      playerName: player.name,
      isFoul: true,
      top: { ...foulHand, line: "top" },
      middle: { ...foulHand, line: "middle" },
      bottom: { ...foulHand, line: "bottom" },
      royaltyTotal: 0,
    };
  }

  const top = evaluateTopHand(player.top);
  const middle = evaluateFiveCardHand("middle", player.middle);
  const bottom = evaluateFiveCardHand("bottom", player.bottom);

  if (compareHandsForOrdering(bottom, middle) < 0 || compareHandsForOrdering(middle, top) < 0) {
    throw new Error(`${player.name} の並びが不正です。ボトム >= ミドル >= トップ になるようにしてください。`);
  }

  return {
    playerId: player.id,
    playerName: player.name,
    isFoul: false,
    top,
    middle,
    bottom,
    royaltyTotal: top.royalty + middle.royalty + bottom.royalty,
  };
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

const buildDecisionId = (leftPlayerId: string, rightPlayerId: string, line: LineKey) =>
  `${leftPlayerId}:${rightPlayerId}:${line}`;

type ComparisonOutcome =
  | { kind: "auto"; winner: ManualDecisionWinner }
  | { kind: "manual"; id: string };

const resolveLineOutcome = (
  left: PlayerEvaluation,
  right: PlayerEvaluation,
  line: LineKey,
  decisions: ManualDecisionMap,
): ComparisonOutcome => {
  if (left.isFoul && right.isFoul) {
    return { kind: "auto", winner: "tie" };
  }
  if (left.isFoul) {
    return { kind: "auto", winner: "right" };
  }
  if (right.isFoul) {
    return { kind: "auto", winner: "left" };
  }

  const leftHand = left[line];
  const rightHand = right[line];

  if (leftHand.strength > rightHand.strength) {
    return { kind: "auto", winner: "left" };
  }
  if (leftHand.strength < rightHand.strength) {
    return { kind: "auto", winner: "right" };
  }
  if (leftHand.primaryValue > rightHand.primaryValue) {
    return { kind: "auto", winner: "left" };
  }
  if (leftHand.primaryValue < rightHand.primaryValue) {
    return { kind: "auto", winner: "right" };
  }

  if (!isComparisonAmbiguous(line, leftHand.category)) {
    return { kind: "auto", winner: "tie" };
  }

  const id = buildDecisionId(left.playerId, right.playerId, line);
  const manualWinner = decisions[id];
  if (!manualWinner) {
    return { kind: "manual", id };
  }
  return { kind: "auto", winner: manualWinner };
};

export const getManualDecisionRequests = (input: MatchInput): ManualDecisionRequest[] => {
  validateInput(input);
  const evaluations = input.players.map(evaluatePlayer);
  const requests: ManualDecisionRequest[] = [];

  for (let leftIndex = 0; leftIndex < evaluations.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < evaluations.length; rightIndex += 1) {
      const left = evaluations[leftIndex];
      const right = evaluations[rightIndex];

      for (const line of ["top", "middle", "bottom"] as const) {
        if (left.isFoul || right.isFoul) {
          continue;
        }
        const outcome = resolveLineOutcome(left, right, line, {});
        if (outcome.kind === "manual") {
          requests.push({
            id: outcome.id,
            leftPlayerId: left.playerId,
            leftPlayerName: left.playerName,
            rightPlayerId: right.playerId,
            rightPlayerName: right.playerName,
            line,
            leftHandName: left[line].handName,
            rightHandName: right[line].handName,
          });
        }
      }
    }
  }

  return requests;
};

export const calculateMatchResult = (
  input: MatchInput,
  decisions: ManualDecisionMap = {},
): MatchResult => {
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
      let leftWins = 0;
      let rightWins = 0;
      let battleDelta = 0;

      const lineResults: LineBattleResult[] = [];
      for (const line of ["top", "middle", "bottom"] as const) {
        const outcome = resolveLineOutcome(left, right, line, decisions);
        if (outcome.kind === "manual") {
          throw new Error("勝敗確認が未完了の段があります。");
        }

        if (outcome.winner === "left") {
          leftWins += 1;
          battleDelta += 1;
          lineResults.push({
            line,
            winnerId: left.playerId,
            winnerName: left.playerName,
            loserId: right.playerId,
            loserName: right.playerName,
            scoreSwing: 1,
            leftHandName: left[line].handName,
            rightHandName: right[line].handName,
          });
        } else if (outcome.winner === "right") {
          rightWins += 1;
          battleDelta -= 1;
          lineResults.push({
            line,
            winnerId: right.playerId,
            winnerName: right.playerName,
            loserId: left.playerId,
            loserName: left.playerName,
            scoreSwing: 1,
            leftHandName: left[line].handName,
            rightHandName: right[line].handName,
          });
        } else {
          lineResults.push({
            line,
            winnerId: null,
            winnerName: null,
            loserId: null,
            loserName: null,
            scoreSwing: 0,
            leftHandName: left[line].handName,
            rightHandName: right[line].handName,
          });
        }
      }

      let scoopWinnerId: string | null = null;
      let scoopWinnerName: string | null = null;
      let scoopDelta = 0;
      if (left.isFoul && !right.isFoul) {
        scoopWinnerId = right.playerId;
        scoopWinnerName = right.playerName;
        battleDelta = -3;
        rightWins = 3;
        leftWins = 0;
        scoopDelta = -3;
      } else if (right.isFoul && !left.isFoul) {
        scoopWinnerId = left.playerId;
        scoopWinnerName = left.playerName;
        battleDelta = 3;
        leftWins = 3;
        rightWins = 0;
        scoopDelta = 3;
      } else if (leftWins === 3) {
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
