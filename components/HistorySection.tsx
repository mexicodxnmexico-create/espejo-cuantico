import { CSSProperties, memo} from "react";

const HISTORY_SECTION_STYLE: CSSProperties = { marginBottom: "1.5rem" };
const LOG_CONTAINER_STYLE: CSSProperties = {
  backgroundColor: "#fafafa",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #eaeaea",
  height: "200px",
  overflowY: "auto",
  fontFamily: "monospace",
  fontSize: "0.9rem"
};
const LIST_STYLE: CSSProperties = { display: "flex", flexDirection: "column-reverse", listStyle: "none", padding: 0, margin: 0 };
const HISTORY_ITEM_STYLE_BASE: CSSProperties = { marginBottom: "0.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" };

// ⚡ BOLT OPTIMIZATION: Extract static styles to prevent re-creation and remove redundant useMemo
const STYLE_LATEST: CSSProperties = { ...HISTORY_ITEM_STYLE_BASE, color: "#000" };
const STYLE_NORMAL: CSSProperties = { ...HISTORY_ITEM_STYLE_BASE, color: "#555" };

const HistoryItem = memo(function HistoryItem({ entry, isLatest }: { entry: string; isLatest: boolean }) {
  return (
    <li style={isLatest ? STYLE_LATEST : STYLE_NORMAL}>
      {isLatest ? "> " : "  "} {entry}
    </li>
  );
});

interface HistorySectionProps {
  historyToRender: string[];
  startIndex: number;
}

export function HistorySection({ historyToRender, startIndex }: HistorySectionProps) {
  return (
    <section>
      <h2 style={HISTORY_SECTION_STYLE}>Historial de Eventos</h2>
      <div
        role="log"
        aria-label="Historial de eventos"
        tabIndex={0}
        style={LOG_CONTAINER_STYLE}
      >
        <ul style={LIST_STYLE}>
          {historyToRender.map((entry, i) => {
            const isLatest = i === historyToRender.length - 1;
            const absoluteIndex = startIndex + i;
            return (
              <HistoryItem
                key={absoluteIndex}
                entry={entry}
                isLatest={isLatest}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}
