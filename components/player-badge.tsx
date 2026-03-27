const PLAYER_SUIT_STYLES = [
  { symbol: "♠", color: "#2563eb", bg: "#dbeafe" },
  { symbol: "♥", color: "#dc2626", bg: "#fee2e2" },
  { symbol: "♦", color: "#ca8a04", bg: "#fef3c7" },
  { symbol: "♣", color: "#16a34a", bg: "#dcfce7" },
] as const;

export function getPlayerSuitStyle(index: number) {
  return PLAYER_SUIT_STYLES[index % PLAYER_SUIT_STYLES.length];
}

export function PlayerBadge({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const style = getPlayerSuitStyle(index);

  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${className}`.trim()}
      style={{
        color: style.color,
        backgroundColor: style.bg,
      }}
      aria-hidden="true"
    >
      {style.symbol}
    </span>
  );
}
