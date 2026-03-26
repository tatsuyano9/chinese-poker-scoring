"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type MatchResult, getLineLabel } from "@/lib/chinese-poker";

const formatDelta = (value: number) => (value > 0 ? `+${value}` : `${value}`);

export function ResultPage() {
  const [result, setResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("chinese-poker:result");
    if (!saved) {
      return;
    }
    setResult(JSON.parse(saved) as MatchResult);
  }, []);

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
    <div className="space-y-4 pb-8">
      <section className="rounded-[28px] border border-base-300 bg-base-100 p-4 shadow-sm">
        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Chinese Poker Scoring</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">結果</h1>
          </div>
          <Link href="/" className="btn btn-outline w-full">
            入力に戻る
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        {result.summaries.map((summary) => (
          <article key={summary.playerId} className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-3 p-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">{summary.playerName}</h2>
                <div className={`badge badge-lg ${summary.totalPoint >= 0 ? "badge-primary" : "badge-neutral"}`}>
                  {formatDelta(summary.totalPoint)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-2xl bg-base-200 px-2 py-3">
                  <div className="text-base-content/60">勝敗</div>
                  <div className="mt-1 text-sm font-semibold">{formatDelta(summary.battlePoint)}</div>
                </div>
                <div className="rounded-2xl bg-base-200 px-2 py-3">
                  <div className="text-base-content/60">スクープ</div>
                  <div className="mt-1 text-sm font-semibold">{formatDelta(summary.scoopPoint)}</div>
                </div>
                <div className="rounded-2xl bg-base-200 px-2 py-3">
                  <div className="text-base-content/60">ロイヤリティ</div>
                  <div className="mt-1 text-sm font-semibold">{formatDelta(summary.royaltyPoint)}</div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <h2 className="card-title text-lg">支払い一覧</h2>
          {result.payments.length === 0 ? (
            <p className="text-sm text-base-content/70">支払いは発生していません。</p>
          ) : (
            <div className="space-y-2">
              {result.payments.map((payment, index) => (
                <div
                  key={`${payment.fromId}-${payment.toId}-${index}`}
                  className="flex items-center justify-between rounded-2xl bg-base-200 px-4 py-3"
                >
                  <div className="text-sm">
                    <span className="font-semibold">{payment.fromName}</span>
                    <span className="mx-2 text-base-content/50">→</span>
                    <span className="font-semibold">{payment.toName}</span>
                  </div>
                  <span className="badge badge-primary badge-lg shrink-0">{payment.point}点</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        {result.pairResults.map((pair) => (
          <div
            key={`${pair.leftPlayerId}-${pair.rightPlayerId}`}
            className="collapse-arrow collapse border border-base-300 bg-base-100 shadow-sm"
          >
            <input type="checkbox" />
            <div className="collapse-title pr-12">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-bold">
                  {pair.leftPlayerName} vs {pair.rightPlayerName}
                </div>
                <div className="text-xs text-base-content/70">
                  {pair.payment
                    ? `${pair.payment.fromName} → ${pair.payment.toName} : ${pair.payment.point}点`
                    : "精算なし"}
                </div>
              </div>
            </div>
            <div className="collapse-content space-y-4">
              <div className="space-y-2">
                {pair.lineResults.map((lineResult) => (
                  <div key={lineResult.line} className="rounded-2xl bg-base-200 p-3 text-sm">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-semibold">{getLineLabel(lineResult.line)}</span>
                      <span className="badge badge-outline">
                        {lineResult.winnerName ? `${lineResult.winnerName} 勝ち` : "引き分け"}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-base-content/75">
                      <p>
                        {pair.leftPlayerName}: {lineResult.leftHandName}
                      </p>
                      <p>
                        {pair.rightPlayerName}: {lineResult.rightHandName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-base-300 p-3 text-sm">
                <div className="flex justify-between">
                  <span>段勝敗差</span>
                  <span>{formatDelta(pair.battleDelta)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>スクープ</span>
                  <span>{pair.scoopWinnerName ? `${pair.scoopWinnerName} +${pair.scoopPoint}` : "なし"}</span>
                </div>
                <div className="mt-2 flex justify-between font-semibold">
                  <span>ロイヤリティ差</span>
                  <span>{formatDelta(pair.royaltyDelta)}</span>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl border border-base-300 p-3">
                  <h4 className="mb-2 text-sm font-semibold">{pair.leftPlayerName} のロイヤリティ</h4>
                  {pair.leftRoyaltyDetails.length === 0 ? (
                    <p className="text-sm text-base-content/60">なし</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {pair.leftRoyaltyDetails.map((detail, index) => (
                        <div key={`${pair.leftPlayerId}-${detail.line}-${index}`} className="flex justify-between gap-3">
                          <span>
                            {getLineLabel(detail.line)}: {detail.label}
                          </span>
                          <span>+{detail.point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-base-300 p-3">
                  <h4 className="mb-2 text-sm font-semibold">{pair.rightPlayerName} のロイヤリティ</h4>
                  {pair.rightRoyaltyDetails.length === 0 ? (
                    <p className="text-sm text-base-content/60">なし</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {pair.rightRoyaltyDetails.map((detail, index) => (
                        <div key={`${pair.rightPlayerId}-${detail.line}-${index}`} className="flex justify-between gap-3">
                          <span>
                            {getLineLabel(detail.line)}: {detail.label}
                          </span>
                          <span>+{detail.point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
