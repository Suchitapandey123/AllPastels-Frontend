"use client";

import { useState } from "react";

const CHANNELS = [
  {
    title: "Customer care",
    detail: "Orders, returns and anything after you buy.",
    value: "care@allpastels.com",
    panel: "bg-ash",
  },
  {
    title: "Wholesale and stockists",
    detail: "Retail partnerships and bulk enquiries.",
    value: "partners@allpastels.com",
    panel: "bg-cotton",
  },
] as const;

export function ContactChannels() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(email);
    window.setTimeout(() => setCopied((c) => (c === email ? null : c)), 1800);
  };

  return (
    <div className="flex flex-col gap-4">
      {CHANNELS.map((channel) => (
        <div
          key={channel.title}
          className={`${channel.panel} rounded-[16px] p-6 sm:p-7`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[1.35rem] leading-none text-burnt-100">
              {channel.title}
            </h2>
            <span
              aria-hidden="true"
              className="hidden h-2 w-2 shrink-0 rounded-full bg-burnt sm:block"
            />
          </div>
          <p className="mt-2 max-w-[38ch] text-[0.9rem] leading-relaxed text-burnt-100/70">
            {channel.detail}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${channel.value}`}
              className="rounded-full bg-floral px-5 py-2.5 text-[0.85rem] font-medium text-burnt-100 transition-colors duration-300 hover:bg-burnt hover:text-floral"
            >
              {channel.value}
            </a>
            <button
              type="button"
              onClick={() => copy(channel.value)}
              aria-live="polite"
              className="rounded-full border border-burnt-100/25 px-4 py-2.5 text-[0.8rem] font-medium text-burnt-100/80 transition-colors duration-300 hover:border-burnt-100/60 hover:text-burnt-100"
            >
              {copied === channel.value ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 rounded-[16px] bg-burnt p-6 sm:p-7">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-floral opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-floral" />
        </span>
        <p className="text-[0.88rem] leading-relaxed text-floral">
          Studio open Mon–Sat, 10am–6pm IST. Replies within one working day.
        </p>
      </div>
    </div>
  );
}

export function ConciergeNote() {
  return (
    <div className="rounded-[16px] bg-powder-900 p-6 sm:p-7">
      <div className="flex items-center gap-2">
        {["#c5d1b3", "#dc7954", "#ffc5c2", "#ffa32a"].map((c) => (
          <span
            key={c}
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-burnt-100/15"
            style={{ backgroundColor: c }}
          />
        ))}
        <span className="ml-2 text-[0.8rem] text-burnt-100/60">
          Cut from the current cloth
        </span>
      </div>
      <p className="font-display mt-4 text-[1.5rem] leading-[1.15] text-burnt-100">
        Tell us what you’re wearing it for — we’ll tell you what will drape
        right.
      </p>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-burnt-100/65">
        Visiting Jaipur? Try pieces in person at 14 Rose Lane, C-Scheme.
        Walk-ins welcome till 5pm.
      </p>
      <p className="mt-5 text-[0.82rem] font-medium text-burnt-100/70">
        A real person reads every message
      </p>
    </div>
  );
}
