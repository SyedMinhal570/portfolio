"use client";

import { useState } from "react";

interface MessagePreviewProps {
  message: string;
  maxLength?: number;
}

export default function MessagePreview({
  message,
  maxLength = 80,
}: MessagePreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = message.length > maxLength;

  if (!isLong) {
    return <span className="text-zinc-400">{message}</span>;
  }

  return (
    <span className="text-zinc-400">
      {expanded ? message : `${message.slice(0, maxLength)}…`}{" "}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="text-xs font-medium text-accent-cyan transition-colors hover:text-white"
      >
        {expanded ? "Show less" : "View more"}
      </button>
    </span>
  );
}
