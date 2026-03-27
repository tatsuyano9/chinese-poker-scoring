"use client";

import { useState } from "react";

const TOP_ROWS = [
  ["66", "1点"],
  ["77", "2点"],
  ["88", "3点"],
  ["99", "4点"],
  ["TT", "5点"],
  ["JJ", "6点"],
  ["QQ", "7点"],
  ["KK", "8点"],
  ["AA", "9点"],
  ["222", "10点"],
  ["333", "11点"],
  ["444", "12点"],
  ["555", "13点"],
  ["666", "14点"],
  ["777", "15点"],
  ["888", "16点"],
  ["999", "17点"],
  ["TTT", "18点"],
  ["JJJ", "19点"],
  ["QQQ", "20点"],
  ["KKK", "21点"],
  ["AAA", "22点"],
] as const;

const MIDDLE_ROWS = [
  ["3カード", "2点"],
  ["ストレート", "4点"],
  ["フラッシュ", "8点"],
  ["フルハウス", "12点"],
  ["4カード", "20点"],
  ["ストフラ", "30点"],
  ["ロイヤル", "50点"],
] as const;

const BOTTOM_ROWS = [
  ["ストレート", "2点"],
  ["フラッシュ", "4点"],
  ["フルハウス", "6点"],
  ["4カード", "10点"],
  ["ストフラ", "15点"],
  ["ロイヤル", "25点"],
] as const;

export function RoyaltyHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-circle btn-primary fixed bottom-24 right-4 z-30 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="ロイヤリティ一覧"
      >
        ?
      </button>

      {open ? (
        <dialog open className="modal modal-open">
          <div className="modal-box my-6 max-h-[calc(100vh-3rem)] max-w-2xl overflow-y-auto">
            <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
              <div className="grid grid-cols-3">
                <section className="row-span-2 border-r border-base-300">
                  <header className="bg-base-200 px-3 py-3 text-center">
                    <h3 className="text-base font-bold">上段</h3>
                    <p className="text-xs text-base-content/60">(TOP)</p>
                  </header>
                  <div className="space-y-1 px-4 py-3 text-sm leading-5">
                    {TOP_ROWS.map(([hand, point]) => (
                      <div key={hand}>
                        <span>{hand}</span>
                        <wbr />
                        <span>{` - ${point}`}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border-r border-base-300 border-b border-base-300">
                  <header className="bg-base-200 px-3 py-3 text-center">
                    <h3 className="text-base font-bold">中段</h3>
                    <p className="text-xs text-base-content/60">(MIDDLE)</p>
                  </header>
                  <div className="space-y-2 px-4 py-4 text-sm leading-6">
                    {MIDDLE_ROWS.map(([hand, point]) => (
                      <div key={hand}>
                        <span>{hand}</span>
                        <br />
                        <span>{` - ${point}`}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border-b border-base-300">
                  <header className="bg-base-200 px-3 py-3 text-center">
                    <h3 className="text-base font-bold">下段</h3>
                    <p className="text-xs text-base-content/60">(BOTTOM)</p>
                  </header>
                  <div className="space-y-2 px-4 py-4 text-sm leading-6">
                    {BOTTOM_ROWS.map(([hand, point]) => (
                      <div key={hand}>
                        <span>{hand}</span>
                        <br />
                        <span>{` - ${point}`}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="col-span-2">
                  <header className="border-b border-base-300 bg-base-200 px-4 py-3 text-center">
                    <h3 className="text-base font-bold">ファンタジー条件</h3>
                  </header>
                  <div className="space-y-5 px-5 py-4 text-sm leading-6">
                    <div>
                      <p>（ファンタジー突入）</p>
                      <p>
                        <span>上段</span>
                        <wbr />
                        <span> - QQ以上</span>
                      </p>
                    </div>
                    <div>
                      <p>（ファンタジー継続）</p>
                      <p>
                        <span>上段</span>
                        <wbr />
                        <span> - 222以上</span>
                      </p>
                      <p>
                        <span>下段</span>
                        <wbr />
                        <span> - 4カード以上</span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="modal-action px-1 pt-4">
              <button type="button" className="btn" onClick={() => setOpen(false)}>
                閉じる
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setOpen(false)}>
              close
            </button>
          </form>
        </dialog>
      ) : null}
    </>
  );
}
