"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { type MatchResult, getCompactHandParts, getCompactLineLabel, getLineLabel } from "@/lib/chinese-poker";
import { PlayerBadge } from "@/components/player-badge";
import { RoyaltyHelp } from "@/components/royalty-help";

const formatDelta = (value: number) => (value > 0 ? `+${value}` : `${value}`);
const getPlayerIndexFromId = (playerId: string) => Number(playerId.split("-")[1] ?? "1") - 1;
const LINE_ORDER = ["top", "middle", "bottom"] as const;

export function ResultPage() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("chinese-poker:result");
    if (!saved) {
      return;
    }
    setResult(JSON.parse(saved) as MatchResult);
  }, []);

  const selectedPlayer = useMemo(() => {
    if (!result || !selectedPlayerId) {
      return null;
    }
    const summary = result.summaries.find((item) => item.playerId === selectedPlayerId);
    if (!summary) {
      return null;
    }

    const relatedPairs = result.pairResults.filter(
      (pair) => pair.leftPlayerId === selectedPlayerId || pair.rightPlayerId === selectedPlayerId,
    );

    return { summary, relatedPairs };
  }, [result, selectedPlayerId]);

  const selectedPair = useMemo(() => {
    if (!result || !selectedPairKey) {
      return null;
    }
    return result.pairResults.find((pair) => `${pair.leftPlayerId}-${pair.rightPlayerId}` === selectedPairKey) ?? null;
  }, [result, selectedPairKey]);

  if (!result) {
    return (
      <div className="hero min-h-[70vh] rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="hero-content text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold">結果データがありません</h1>
            <p className="text-sm text-base-content/70">入力画面から計算を実行してください。</p>
            <Link href="/" className="btn btn-primary">
              入力画面へ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RoyaltyHelp />
      <div className="space-y-4 pb-8">
        <section className="rounded-[24px] border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Chinese Poker Scoring</p>
                <h1 className="mt-0.5 text-xl font-bold tracking-tight">結果</h1>
              </div>
              <Link href="/" className="btn btn-xs btn-outline min-w-20 shrink-0">
                入力に戻る
              </Link>
            </div>
          </div>
        </section>

        <section className={`grid gap-3 ${result.summaries.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {result.summaries.map((summary) => (
            <button
              key={summary.playerId}
              type="button"
              className="card border border-base-300 bg-base-100 text-left shadow-sm transition hover:border-base-content/20"
              onClick={() => setSelectedPlayerId(summary.playerId)}
            >
              <div className={`card-body gap-2 ${result.summaries.length === 3 ? "p-3.5" : "p-3"}`}>
                <div
                  className={
                    result.summaries.length === 3
                      ? "flex flex-col gap-3"
                      : "flex items-center justify-between gap-2"
                  }
                >
                  <div className={`flex min-w-0 items-center gap-2 ${result.summaries.length === 3 ? "justify-center" : ""}`}>
                    <PlayerBadge index={getPlayerIndexFromId(summary.playerId)} className="h-6 w-6 text-xs" />
                    <h2 className="truncate text-sm font-bold">{summary.playerName}</h2>
                  </div>
                  <div className={result.summaries.length === 3 ? "flex justify-end" : ""}>
                    <div className={`badge badge-sm ${summary.totalPoint >= 0 ? "badge-primary" : "badge-neutral"}`}>
                      {formatDelta(summary.totalPoint)}
                    </div>
                  </div>
                </div>
                {result.summaries.length !== 3 ? (
                  <p className="text-[11px] text-base-content/55">タップで内訳</p>
                ) : null}
              </div>
            </button>
          ))}
        </section>

        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">対戦一覧</h2>
              <span className="text-xs text-base-content/50">{result.pairResults.length}卓</span>
            </div>
            <div className="space-y-2">
              {result.pairResults.map((pair) => (
                <button
                  type="button"
                  key={`${pair.leftPlayerId}-${pair.rightPlayerId}`}
                  className="flex w-full items-center justify-between rounded-2xl bg-base-200 px-3 py-3 text-left transition hover:bg-base-300/70"
                  onClick={() => setSelectedPairKey(`${pair.leftPlayerId}-${pair.rightPlayerId}`)}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <PlayerBadge index={getPlayerIndexFromId(pair.leftPlayerId)} className="h-5 w-5 text-[10px]" />
                      <span className="truncate">{pair.leftPlayerName}</span>
                      <span className="text-base-content/40">vs</span>
                      <PlayerBadge index={getPlayerIndexFromId(pair.rightPlayerId)} className="h-5 w-5 text-[10px]" />
                      <span className="truncate">{pair.rightPlayerName}</span>
                    </div>
                    <p className="mt-1 text-xs text-base-content/60">
                      {pair.payment
                        ? `${pair.payment.fromName} → ${pair.payment.toName} : ${pair.payment.point}点`
                        : "精算なし"}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none mr-1 shrink-0 text-base-content/55"
                    aria-hidden="true"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="h-5 w-5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {selectedPlayer ? (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex items-center gap-3">
              <PlayerBadge index={getPlayerIndexFromId(selectedPlayer.summary.playerId)} />
              <div>
                <h3 className="text-lg font-bold">{selectedPlayer.summary.playerName}</h3>
                <p className="text-sm text-base-content/60">合計 {formatDelta(selectedPlayer.summary.totalPoint)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-2xl bg-base-200 px-2 py-3">
                <div className="text-base-content/60">勝敗</div>
                <div className="mt-1 text-sm font-semibold">{formatDelta(selectedPlayer.summary.battlePoint)}</div>
              </div>
              <div className="rounded-2xl bg-base-200 px-2 py-3">
                <div className="text-base-content/60">スクープ</div>
                <div className="mt-1 text-sm font-semibold">{formatDelta(selectedPlayer.summary.scoopPoint)}</div>
              </div>
              <div className="rounded-2xl bg-base-200 px-2 py-3">
                <div className="text-base-content/60">ロイヤリティ</div>
                <div className="mt-1 text-sm font-semibold">{formatDelta(selectedPlayer.summary.royaltyPoint)}</div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <h4 className="text-sm font-semibold">対戦ごとの収支</h4>
              {selectedPlayer.relatedPairs.map((pair) => {
                const isLeft = pair.leftPlayerId === selectedPlayer.summary.playerId;
                const opponentId = isLeft ? pair.rightPlayerId : pair.leftPlayerId;
                const opponentName = isLeft ? pair.rightPlayerName : pair.leftPlayerName;
                const delta = isLeft ? pair.totalDelta : -pair.totalDelta;

                return (
                  <div key={`${pair.leftPlayerId}-${pair.rightPlayerId}`} className="flex items-center justify-between rounded-2xl bg-base-200 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <PlayerBadge index={getPlayerIndexFromId(opponentId)} className="h-5 w-5 text-[10px]" />
                      <span>{opponentName}</span>
                    </div>
                    <span className="font-semibold">{formatDelta(delta)}</span>
                  </div>
                );
              })}
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setSelectedPlayerId(null)}>
                閉じる
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setSelectedPlayerId(null)}>
              close
            </button>
          </form>
        </dialog>
      ) : null}

      {selectedPair ? (
        <dialog open className="modal modal-open">
          <div className="modal-box my-6 max-h-[calc(100vh-3rem)] max-w-lg overflow-y-auto">
            <div className="mb-4 flex items-center justify-center gap-2 text-base font-bold">
              <PlayerBadge index={getPlayerIndexFromId(selectedPair.leftPlayerId)} className="h-6 w-6 text-xs" />
              <span>{selectedPair.leftPlayerName}</span>
              <span className="text-base-content/40">vs</span>
              <PlayerBadge index={getPlayerIndexFromId(selectedPair.rightPlayerId)} className="h-6 w-6 text-xs" />
              <span>{selectedPair.rightPlayerName}</span>
            </div>

            <div className="rounded-2xl border border-base-300 p-3">
              <div className="grid grid-cols-[3.25rem_1fr_1fr] items-center gap-2 border-b border-base-300 pb-2 text-[11px] font-semibold text-base-content/55">
                <span />
                <span className="text-center">{selectedPair.leftPlayerName}</span>
                <span className="text-center">{selectedPair.rightPlayerName}</span>
              </div>

              <div className="mt-2 space-y-2">
              {LINE_ORDER.map((line) => {
                const lineResult = selectedPair.lineResults.find((item) => item.line === line);
                const leftRoyalty = selectedPair.leftRoyaltyDetails.find((detail) => detail.line === line);
                const rightRoyalty = selectedPair.rightRoyaltyDetails.find((detail) => detail.line === line);
                if (!lineResult) {
                  return null;
                }

                const leftWon = lineResult.winnerId === selectedPair.leftPlayerId;
                const rightWon = lineResult.winnerId === selectedPair.rightPlayerId;
                const leftHand = getCompactHandParts(lineResult.leftHandName);
                const rightHand = getCompactHandParts(lineResult.rightHandName);

                return (
                  <div key={line} className="grid grid-cols-[3.25rem_1fr_1fr] items-center gap-2">
                    <div className="text-xs font-semibold">{getCompactLineLabel(line)}</div>
                    <div
                      className={`rounded-xl border px-2 py-2 text-center text-xs ${
                        leftWon
                          ? "border-sky-300 bg-sky-50 text-sky-950"
                          : rightWon
                            ? "border-base-300 bg-base-100 text-base-content/70"
                            : "border-amber-300 bg-amber-50 text-amber-950"
                      }`}
                    >
                      <div className="grid grid-cols-[1fr_2.1rem] items-center gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 text-left text-[11px]">
                          {leftHand.rank ? (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current/20 bg-white/70 px-1 text-[10px] font-bold">
                              {leftHand.rank}
                            </span>
                          ) : null}
                          <span className="truncate">{leftHand.label}</span>
                        </div>
                        <span className="border-l border-current/15 pl-2 text-right text-[10px] font-semibold">
                          {leftRoyalty ? `+${leftRoyalty.point}` : "0"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`rounded-xl border px-2 py-2 text-center text-xs ${
                        rightWon
                          ? "border-rose-300 bg-rose-50 text-rose-950"
                          : leftWon
                            ? "border-base-300 bg-base-100 text-base-content/70"
                            : "border-amber-300 bg-amber-50 text-amber-950"
                      }`}
                    >
                      <div className="grid grid-cols-[1fr_2.1rem] items-center gap-2">
                        <div className="flex min-w-0 items-center gap-1.5 text-left text-[11px]">
                          {rightHand.rank ? (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current/20 bg-white/70 px-1 text-[10px] font-bold">
                              {rightHand.rank}
                            </span>
                          ) : null}
                          <span className="truncate">{rightHand.label}</span>
                        </div>
                        <span className="border-l border-current/15 pl-2 text-right text-[10px] font-semibold">
                          {rightRoyalty ? `+${rightRoyalty.point}` : "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-base-300 p-3 text-sm">
              <div className="flex justify-between">
                <span>段勝敗差</span>
                <span>{formatDelta(selectedPair.battleDelta)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>スクープ</span>
                <span className="flex items-center gap-1">
                  {selectedPair.scoopWinnerId ? (
                    <>
                      <PlayerBadge
                        index={getPlayerIndexFromId(selectedPair.scoopWinnerId)}
                        className="h-5 w-5 text-[10px]"
                      />
                      <span>
                        {selectedPair.scoopWinnerId === selectedPair.leftPlayerId
                          ? `+${selectedPair.scoopPoint}`
                          : `-${selectedPair.scoopPoint}`}
                      </span>
                    </>
                  ) : (
                    "0"
                  )}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>ロイヤリティ差</span>
                <span>{formatDelta(selectedPair.royaltyDelta)}</span>
              </div>
              <div className="mt-2 border-t border-base-300 pt-2 flex justify-between font-semibold">
                <span>最終差分</span>
                <span>{formatDelta(selectedPair.totalDelta)}</span>
              </div>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setSelectedPairKey(null)}>
                閉じる
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setSelectedPairKey(null)}>
              close
            </button>
          </form>
        </dialog>
      ) : null}
    </>
  );
}
