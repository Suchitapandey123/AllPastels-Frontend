"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { verifyEmail } from "@/api";

/**
 * VerifyEmailForm — confirms the email-verification link.
 *
 * Reads the single-use `token` from the URL and calls the backend once.
  * The token is only ever sent to the backend — never logged or rendered.
  * The backend token is single-use (its hash is cleared on success), so
  * exactly one fetch runs per token/attempt and every effect invocation
  * subscribes to that shared promise: without this, a duplicate call
  * consumes the link and reports the fresh link as invalid, while a
  * send-once/skip-later guard drops the result on remount and sticks the
  * page on "Verifying".
  * Four outcomes, each a complete state: a missing link, a verifying
 * indicator, a success panel handing back to sign in, and an
 * invalid/expired panel plus a distinct network-error panel with retry.
 */

type Status = "missing" | "loading" | "success" | "invalid" | "expired" | "network" | "server";

export function VerifyEmailForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "loading" : "missing");
  const [attempt, setAttempt] = useState(0);
  // In-flight verification request, shared across effect invocations.
  // The backend token is single-use, so exactly one fetch runs per
  // token/attempt — but every mounted invocation subscribes to that same
  // promise. (A send-once/skipped-later guard would drop the result when a
  // remount discards the first subscription and suppresses the second,
  // sticking the page on "Verifying" with no effective request.)
  // Held in memory only — never logged or rendered.
  const inflight = useRef<{ key: string; promise: ReturnType<typeof verifyEmail> } | null>(null);

  useEffect(() => {
    if (!token) return;
    const key = `${attempt}:${token}`;
    let entry = inflight.current;
    if (!entry || entry.key !== key) {
      entry = { key, promise: verifyEmail(token) };
      inflight.current = entry;
    }
    let cancelled = false;
    // Both handlers end `loading`: success/failure map to their panel and
    // any unexpected rejection falls back to retryable `network`, so the
    // page can never stick on "Verifying".
    entry.promise.then(
      (result) => {
        if (cancelled) return;
        setStatus(result.ok ? "success" : result.reason);
      },
      () => {
        if (cancelled) return;
        setStatus("network");
      },
    );
    return () => {
      cancelled = true;
    };
    // Re-runs when the token changes or the visitor retries.
  }, [token, attempt]);

  /* ------------------------------------------------------------ No link */
  if (status === "missing") {
    return (
      <div className="ap-anim-rise">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          Link not found
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          That link didn’t <em className="font-light italic text-burnt">work</em>.
        </h2>
        <p className="ap-body mt-4 text-ink/65">
          Verification links arrive by email after you create an account — open
          the newest one and you will land straight back here.
        </p>
        <Button href="/signup" variant="primary" size="lg" className="mt-7 w-full" withArrow>
          Create an account
        </Button>
        <p className="ap-body mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-line pt-6 text-center text-sm text-ink/60">
          Already verified?{" "}
          <Link
            href="/login"
            className="ap-eyebrow text-burnt transition-colors duration-300 hover:text-burnt-400"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------ Loading */
  if (status === "loading") {
    return (
      <div className="ap-anim-rise" aria-live="polite">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          Verifying
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          Checking your <em className="font-light italic text-burnt">link</em>.
        </h2>
        <p className="ap-body mt-4 text-ink/65">
          Give us a moment while we confirm your email with the boutique…
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------ Success */
  if (status === "success") {
    return (
      <div className="ap-anim-rise">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          Email verified
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          You’re <em className="font-light italic text-burnt">in</em>.
        </h2>
        <p className="ap-body mt-4 text-ink/65">
          Your email is confirmed — sign in to see your orders, addresses and
          every saved piece.
        </p>
        <Button href="/login" variant="primary" size="lg" className="mt-7 w-full" withArrow>
          Sign in
        </Button>
      </div>
    );
  }

  /* ------------------------------------------------------ Server error */
  if (status === "network" || status === "server") {
    return (
      <div className="ap-anim-rise">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          Connection trouble
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          We couldn’t <em className="font-light italic text-burnt">reach</em> the boutique.
        </h2>
        <p className="ap-body mt-4 text-ink/65">
          Check your connection and try again — your link stays valid, nothing
          has been used up.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-7 w-full"
          withArrow
          onClick={() => {
            setStatus("loading");
            setAttempt((count) => count + 1);
          }}
        >
          Try again
        </Button>
        <p className="ap-body mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-line pt-6 text-center text-sm text-ink/60">
          Still stuck?{" "}
          <Link
            href="/contact"
            className="ap-eyebrow text-burnt transition-colors duration-300 hover:text-burnt-400"
          >
            Contact us
          </Link>
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------ Invalid */
  if (status === "invalid") {
    return (
      <div className="ap-anim-rise">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          Invalid link
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          That link didn’t <em className="font-light italic text-burnt">work</em>.
        </h2>
        <p className="ap-body mt-4 text-ink/65" role="alert">
          Verification links are single-use — this one was already used, isn’t
          quite right, or was replaced by a newer email. Open the newest email
          or request a fresh link.
        </p>
        <Button href="/signup" variant="primary" size="lg" className="mt-7 w-full" withArrow>
          Create an account
        </Button>
        <p className="ap-body mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-line pt-6 text-center text-sm text-ink/60">
          Already verified?{" "}
          <Link
            href="/login"
            className="ap-eyebrow text-burnt transition-colors duration-300 hover:text-burnt-400"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------ Expired */
  return (
    <div className="ap-anim-rise">
      <p className="ap-eyebrow flex items-center gap-3 text-burnt">
        <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
        Link expired
      </p>
      <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
        That link has <em className="font-light italic text-burnt">expired</em>.
      </h2>
      <p className="ap-body mt-4 text-ink/65" role="alert">
        Verification links are single-use and expire after a day — create your
        account again or request a fresh link and you will be straight back in.
      </p>
      <Button href="/signup" variant="primary" size="lg" className="mt-7 w-full" withArrow>
        Create an account
      </Button>
      <p className="ap-body mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-line pt-6 text-center text-sm text-ink/60">
        Already verified?{" "}
        <Link
          href="/login"
          className="ap-eyebrow text-burnt transition-colors duration-300 hover:text-burnt-400"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
