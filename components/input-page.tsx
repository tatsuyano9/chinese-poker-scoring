"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type FiveCardCategory,
  type FiveCardLineInput,
  type PlayerInput,
  type Rank,
  type TopCategory,
  type TopLineInput,
  FIVE_CARD_CATEGORY_OPTIONS,
  RANKS,
  TOP_CATEGORY_OPTIONS,
  calculateMatchResult,
  getLineLabel,
  getPrimaryRankLabel,
} from "@/lib/chinese-poker";

type PlayerDraft = PlayerInput;

const createTopLine = (category: TopCategory = "highCard", primaryRank: Rank = "A"): TopLineInput => ({
  category,
  primaryRank,
});

const createFiveCardLine = (
  category: FiveCardCategory = "highCard",
  primaryRank: Rank = "A",
): FiveCardLineInput => ({
  category,
  primaryRank,
});

const createPlayer = (index: number): PlayerDraft => ({
  id: `player-${index + 1}`,
  name: `プレイヤー${index + 1}`,
  top: createTopLine("highCard", "Q"),
  middle: createFiveCardLine("onePair", "K"),
  bottom: createFiveCardLine("flush", "A"),
});

const RANK_OPTIONS = [...RANKS].reverse();
const LINE_ORDER: LineKeyDraft[] = ["top", "middle", "bottom"];

type LineKeyDraft = "top" | "middle" | "bottom";

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
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);

  const activePlayers = useMemo(() => players.slice(0, playerCount), [playerCount, players]);
  const currentPlayer = activePlayers[currentPlayerIndex];

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

  const handleCategoryChange = (
    playerIndex: number,
    line: LineKeyDraft,
    value: TopCategory | FiveCardCategory,
  ) => {
    updatePlayer(playerIndex, (player) => {
      const currentLine = player[line];
      const nextPrimaryRank = value === "royalFlush" ? "A" : currentLine.primaryRank;
      return {
        ...player,
        [line]: {
          category: value,
          primaryRank: nextPrimaryRank,
        },
      };
    });
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

  const handleSubmit = () => {
    try {
      const input = {
        players: activePlayers.map((player) => ({
          ...player,
          name: player.name.trim(),
        })),
      };
      const result = calculateMatchResult(input);
      sessionStorage.setItem("chinese-poker:result", JSON.stringify(result));
      setError(null);
      router.push("/result");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "計算に失敗しました。");
    }
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
                <input
                  className="input input-bordered h-11 flex-1 text-base font-semibold"
                  value={currentPlayer.name}
                  onChange={(event) => handleNameChange(currentPlayerIndex, event.target.value)}
                />
                <div className="badge badge-outline shrink-0">P{currentPlayerIndex + 1}</div>
              </div>

              <div className="space-y-3">
                {LINE_ORDER.map((line) => {
                  const lineValue = currentPlayer[line];
                  const categoryOptions = line === "top" ? TOP_CATEGORY_OPTIONS : FIVE_CARD_CATEGORY_OPTIONS;

                  return (
                    <div key={line} className="rounded-2xl bg-base-200/70 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-bold">{getLineLabel(line)}</h2>
                        <span className="text-xs text-base-content/60">
                          {getPrimaryRankLabel(line, lineValue.category, lineValue.primaryRank)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <select
                          className="select select-bordered w-full"
                          value={lineValue.category}
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
                          value={lineValue.primaryRank}
                          onChange={(event) => handleRankChange(currentPlayerIndex, line, event.target.value as Rank)}
                          disabled={isRoyal(lineValue.category)}
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
            同じ役同士は「主なランク」で比較します。
          </p>
          <button type="button" className="btn btn-primary btn-lg w-full" onClick={handleSubmit}>
            結果を計算する
          </button>
        </div>
      </div>
    </div>
  );
}
