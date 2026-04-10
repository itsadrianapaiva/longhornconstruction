"use client";

import * as React from "react";

/** The little triangular tail for the bubble */
function ChatBubbleWing({
  className = "",
  pathClassName = "",
}: {
  className?: string;
  pathClassName?: string;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="27"
      aria-hidden="true"
    >
      <path
        className={pathClassName}
        d="M21.843 37.001c3.564 0 5.348-4.309 2.829-6.828L3.515 9.015A12 12 0 0 1 0 .53v36.471h21.843z"
      />
    </svg>
  );
}

/** Solid chat bubble card to overlay on images/maps */
export function MapChatBubble({
  message,
  className = "",
  bubbleColor = "#0E0F12", // uses dark surface by default; pass a tokenized color if desired
}: {
  message: string;
  className?: string;
  bubbleColor?: string;
}) {
  return (
    <div
      className={[
        "absolute z-10 max-w-[17.5rem]",
        "pt-2.5 pr-2.5 pb-7 pl-5",
        "rounded-t-xl rounded-br-xl",
        "text-white shadow-lg",
        className,
      ].join(" ")}
      style={{ backgroundColor: bubbleColor }}
    >
      <p className="text-sm pr-2 pt-2">{message}</p>
      <ChatBubbleWing
        className="absolute right-full bottom-0 -scale-x-100"
        pathClassName="fill-[#0E0F12]"
      />
    </div>
  );
}
