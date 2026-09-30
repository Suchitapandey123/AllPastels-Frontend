"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

/**
 * Newsletter — email capture.
 *
 * Client-side only for now: the form validates and confirms inline, which
 * is the whole interaction. When a marketing platform is connected, swap
 * `handleSubmit` for the provider's action and delete the local state.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }

    setStatus("done");
    setEmail("");
  };

  return (
    <div className="border-b border-line bg-ash-400">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="ap-eyebrow mb-4 flex items-center gap-3 text-ash-800/70">
              <span aria-hidden="true" className="h-px w-8 bg-ash-800/40" />
              Newsletter
            </p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] text-ash-800">
              Stay in the loop.
            </h2>
            <p className="ap-body mt-4 max-w-md text-ash-800/75">
              Be the first to discover new collections, stories and special offers.
            </p>
          </div>

          <div>
            {status === "done" ? (
              <p
                role="status"
                className="flex items-center gap-3 border border-ash-800/20 bg-floral-400/60 px-5 py-5 text-ash-800"
              >
                <CheckIcon className="h-5 w-5 shrink-0" />
                <span className="text-sm">
                  Thank you — you are on the list. Look out for our next note.
                </span>
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="w-full">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                <div
                  className={
                    status === "error"
                      ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:border-b sm:border-burnt sm:pb-3"
                      : "flex flex-col gap-3 sm:flex-row sm:items-center sm:border-b sm:border-ash-800/25 sm:pb-3"
                  }
                >
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Your email address"
                    autoComplete="email"
                    aria-invalid={status === "error"}
                    aria-describedby={status === "error" ? "newsletter-error" : undefined}
                    className="w-full flex-1 bg-transparent py-2 text-base text-ash-800 outline-none placeholder:text-ash-800/45"
                  />

                  <button
                    type="submit"
                    className="group ap-eyebrow inline-flex shrink-0 items-center gap-2 self-start bg-ash-800 px-6 py-3.5 text-floral-50 transition-colors duration-500 hover:bg-burnt sm:self-auto"
                  >
                    Subscribe
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>

                {status === "error" && (
                  <p id="newsletter-error" role="alert" className="ap-body mt-3 text-xs text-burnt-700">
                    Please enter a valid email address so we can reach you.
                  </p>
                )}

                <p className="ap-body mt-4 text-xs text-ash-800/55">
                  By subscribing you agree to our privacy policy. Unsubscribe any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
