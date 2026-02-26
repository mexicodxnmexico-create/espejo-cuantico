"use client";

import { memo } from "react";

interface HistoryItemProps {
  entry: string;
  isLatest: boolean;
}

export const HistoryItem = memo(function HistoryItem({ entry, isLatest }: HistoryItemProps) {
  return (
    <li
      style={{
        marginBottom: "0.5rem",
        borderBottom: "1px solid #eee",
        paddingBottom: "0.5rem",
        color: isLatest ? "#000" : "#555",
      }}
    >
      {isLatest ? "> " : "  "} {entry}
    </li>
  );
});

HistoryItem.displayName = "HistoryItem";
