"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type FiveCardCategory,
  type ManualDecisionMap,
  type ManualDecisionRequest,
  type PlayerInput,
  type Rank,
  type TopCategory,
  FIVE_CARD_CATEGORY_OPTIONS,
  RANKS,
  TOP_CATEGORY_OPTIONS,
  calculateMatchResult,
  createFiveCardLineInput,
  createTopLineInput,
  getLineLabel,
  getLineSummary,
  getManualDecisionRequests,
} from "@/lib/chinese-poker";
import { PlayerBadge } from "@/components/player-badge";
import { RoyaltyHelp } from "@/components/royalty-help";

type PlayerDraft = PlayerInput;
type LineKeyDraft = "top" | "middle" | "bottom";

const createPlayer = (index: number): PlayerDraft => ({
  id: `player-${index + 1}`,
  name: `プレイヤー${index + 1}`,
  isFoul: false,
  top: createTopLineInput("highCard", "Q"),
  middle: createFiveCardLineInput("onePair", "K"),
  bottom: createFiveCardLineInput("flush", "A"),
});

const RANK_OPTIONS = [...RANKS].reverse();
const LINE_ORDER: LineKeyDraft[] = ["top", "middle", "bottom"];
const isRoyal = (category: FiveCardCategory | TopCategory) => category === "royalFlush";

export function InputPage() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<3 | 4>(3);
  const [players, setPlayers] = useState<PlayerDraft[]>([
    createPlayer(0),
    createPlayer(1),
    createPlayer(2),
    createPlayer(3),
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingInput, setPendingInput] = useState<{ players: PlayerDraft[] } | null>(null);
  const [decisionRequests, setDecisionRequests] = useState<ManualDecisionRequest[]>([]);
  const [manualDecisions, setManualDecisions] = useState<ManualDecisionMap>({});
  const [decisionIndex, setDecisionIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);

  const activePlayers = useMemo(() => players.slice(0, playerCount), [playerCount, players]);
  const currentPlayer = activePlayers[currentPlayerIndex];
  const currentDecision = decisionRequests[decisionIndex] ?? null;

  useEffect(() => {
    if (currentPlayerIndex > playerCount - 1) {
      setCurrentPlayerIndex(playerCount - 1);
    }
  }, [currentPlayerIndex, playerCount]);

  const updatePlayer = (playerIndex: number, updater: (player: PlayerDraft) => PlayerDraft) => {
    setPlayers((current) => current.map((player, index) => (index === playerIndex ? updater(player) : player)));
  };

  const handleNameChange = (playerIndex: number, value: string) => {
    updatePlayer(playerIndex, (player) => ({ ...player, name: value }));
  };

  const handleFoulChange = (playerIndex: number, checked: boolean) => {
    updatePlayer(playerIndex, (player) => ({
      ...player,
      isFoul: checked,
    }));
  };

  const handleCategoryChange = (
    playerIndex: number,
    line: LineKeyDraft,
    value: TopCategory | FiveCardCategory,
  ) => {
    updatePlayer(playerIndex, (player) => ({
      ...player,
      [line]: {
        category: value,
        primaryRank: value === "royalFlush" ? "A" : player[line].primaryRank,
      },
    }));
  };

  const handleRankChange = (playerIndex: number, line: LineKeyDraft, value: Rank) => {
    updatePlayer(playerIndex, (player) => ({
      ...player,
      [line]: {
        ...player[line],
        primaryRank: value,
      },
    }));
  };

  const finishCalculation = (input: { players: PlayerDraft[] }, decisions: ManualDecisionMap) => {
    const result = calculateMatchResult(input, decisions);
    sessionStorage.setItem("chinese-poker:result", JSON.stringify(result));
    setError(null);
    setPendingInput(null);
    setDecisionRequests([]);
    setManualDecisions({});
    setDecisionIndex(0);
    router.push("/result");
  };

  const handleSubmit = () => {
    try {
      const input = {
        players: activePlayers.map((player) => ({
          ...player,
          name: player.name.trim(),
        })),
      };
      const requests = getManualDecisionRequests(input);
      if (requests.length === 0) {
        finishCalculation(input, {});
        return;
      }

      setPendingInput(input);
      setDecisionRequests(requests);
      setManualDecisions({});
      setDecisionIndex(0);
      setError(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "計算に失敗しました。");
    }
  };

  const handleDecision = (winner: "left" | "right" | "tie") => {
    if (!pendingInput || !currentDecision) {
      return;
    }

    const nextDecisions = {
      ...manualDecisions,
      [currentDecision.id]: winner,
    };

    if (decisionIndex === decisionRequests.length - 1) {
      try {
        finishCalculation(pendingInput, nextDecisions);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "計算に失敗しました。");
      }
      return;
    }

    setManualDecisions(nextDecisions);
    setDecisionIndex((current) => current + 1);
  };

  const closeDecisionModal = () => {
    setPendingInput(null);
    setDecisionRequests([]);
    setManualDecisions({});
    setDecisionIndex(0);
  };

  const showPreviousPlayer = () => {
    setCurrentPlayerIndex((current) => Math.max(0, current - 1));
  };

  const showNextPlayer = () => {
    setCurrentPlayerIndex((current) => Math.min(playerCount - 1, current + 1));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) {
      return;
    }
    touchDeltaXRef.current = (event.changedTouches[0]?.clientX ?? 0) - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    const threshold = 56;
    if (touchDeltaXRef.current <= -threshold) {
      showNextPlayer();
    } else if (touchDeltaXRef.current >= threshold) {
      showPreviousPlayer();
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  return (
    <>
      <RoyaltyHelp />
      <div className="space-y-4 pb-28">
        <section className="rounded-[28px] border border-base-300 bg-base-100 px-4 py-5 shadow-sm">
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Chinese Poker Scoring</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">役入力</h1>
            </div>
            <div className="join w-full">
              <button
                type="button"
                className={`btn btn-sm join-item flex-1 ${playerCount === 3 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setPlayerCount(3)}
              >
                3人
              </button>
              <button
                type="button"
                className={`btn btn-sm join-item flex-1 ${playerCount === 4 ? "btn-primary" : "btn-outline"}`}
                onClick={() => setPlayerCount(4)}
              >
                4人
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div role="alert" className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        ) : null}

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div
            className="card-body gap-4 overflow-hidden p-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="btn btn-circle btn-outline btn-sm"
                onClick={showPreviousPlayer}
                disabled={currentPlayerIndex === 0}
              >
                ←
              </button>
              <div className="text-center">
                <p className="text-xs text-base-content/50">
                  {currentPlayerIndex + 1} / {playerCount}
                </p>
                <p className="text-sm font-bold">入力プレイヤー</p>
              </div>
              <button
                type="button"
                className="btn btn-circle btn-outline btn-sm"
                onClick={showNextPlayer}
                disabled={currentPlayerIndex === playerCount - 1}
              >
                →
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {activePlayers.map((player, index) => (
                <button
                  key={player.id}
                  type="button"
                  className={`btn btn-xs ${index === currentPlayerIndex ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setCurrentPlayerIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentPlayer ? (
              <div key={currentPlayer.id} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-3">
                  <PlayerBadge index={currentPlayerIndex} />
                  <input
                    className="input input-bordered h-11 flex-1 text-base font-semibold"
                    value={currentPlayer.name ?? ""}
                    onChange={(event) => handleNameChange(currentPlayerIndex, event.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-base-300 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">ファウル</p>
                  <p className="text-xs text-base-content/55">チェックすると自動でファウル精算します</p>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-error"
                  checked={currentPlayer.isFoul ?? false}
                  onChange={(event) => handleFoulChange(currentPlayerIndex, event.target.checked)}
                />
              </label>

                <div className={`space-y-3 ${currentPlayer.isFoul ? "pointer-events-none opacity-45" : ""}`}>
                  {LINE_ORDER.map((line) => {
                    const lineValue = currentPlayer[line];
                    const categoryOptions = line === "top" ? TOP_CATEGORY_OPTIONS : FIVE_CARD_CATEGORY_OPTIONS;

                    return (
                      <div key={line} className="rounded-2xl bg-base-200/70 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h2 className="text-sm font-bold">{getLineLabel(line)}</h2>
                          <span className="text-right text-xs text-base-content/60">
                            {getLineSummary(line, lineValue)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <select
                            className="select select-bordered w-full"
                            value={lineValue.category ?? ""}
                            disabled={currentPlayer.isFoul}
                            onChange={(event) =>
                              handleCategoryChange(
                                currentPlayerIndex,
                                line,
                                event.target.value as TopCategory | FiveCardCategory,
                              )
                            }
                          >
                            {categoryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <select
                            className="select select-bordered w-full"
                            value={lineValue.primaryRank ?? ""}
                            disabled={currentPlayer.isFoul || isRoyal(lineValue.category)}
                            onChange={(event) => handleRankChange(currentPlayerIndex, line, event.target.value as Rank)}
                          >
                            {RANK_OPTIONS.map((rank) => (
                              <option key={rank} value={rank}>
                                {isRoyal(lineValue.category) ? "A固定" : rank}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-base-300 bg-base-100/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
            <p className="text-center text-xs text-base-content/60">
              判定できない段だけ、計算前に勝敗を確認します。
            </p>
            <button type="button" className="btn btn-primary btn-lg w-full" onClick={handleSubmit}>
              結果を計算する
            </button>
          </div>
        </div>
      </div>

      {currentDecision ? (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">勝敗確認</h3>
            <p className="mt-2 text-sm text-base-content/70">
              入力だけでは判定できないため、この段の勝敗を選んでください。
            </p>
            <div className="mt-4 rounded-2xl bg-base-200 p-4 text-sm">
              <p className="font-semibold">{getLineLabel(currentDecision.line)}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <PlayerBadge index={Number(currentDecision.leftPlayerId.split("-")[1]) - 1} className="h-7 w-7 text-sm" />
                  <p>
                    {currentDecision.leftPlayerName}: {currentDecision.leftHandName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PlayerBadge index={Number(currentDecision.rightPlayerId.split("-")[1]) - 1} className="h-7 w-7 text-sm" />
                  <p>
                    {currentDecision.rightPlayerName}: {currentDecision.rightHandName}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-base-content/60">
                {decisionIndex + 1} / {decisionRequests.length}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2">
              <button type="button" className="btn btn-primary justify-start" onClick={() => handleDecision("left")}>
                <PlayerBadge index={Number(currentDecision.leftPlayerId.split("-")[1]) - 1} className="mr-2 h-7 w-7 text-sm" />
                {currentDecision.leftPlayerName} の勝ち
              </button>
              <button type="button" className="btn btn-primary btn-outline justify-start" onClick={() => handleDecision("right")}>
                <PlayerBadge index={Number(currentDecision.rightPlayerId.split("-")[1]) - 1} className="mr-2 h-7 w-7 text-sm" />
                {currentDecision.rightPlayerName} の勝ち
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => handleDecision("tie")}>
                引き分け
              </button>
            </div>
            <div className="modal-action mt-4">
              <button type="button" className="btn btn-ghost" onClick={closeDecisionModal}>
                キャンセル
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={closeDecisionModal}>
              close
            </button>
          </form>
        </dialog>
      ) : null}
    </>
  );
}
