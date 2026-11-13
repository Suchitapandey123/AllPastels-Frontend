"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/auth";
import { forgotPassword } from "@/api";

/**
 * ForgotPasswordForm — step one of the password-reset flow.
 *
 * Asks the backend to issue a single-use, expiring reset token and email the
 * reset link. The backend answers generically so it never reveals whether an
 * account exists; `emailSent` tells this panel whether delivery is actually
 * enabled, so it only promises an inbox arrival when one is possible.
 */

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [requested, setRequested] = useState<{
    message: string;
    emailSent: boolean;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    if (!isValidEmail(email)) {
      setFieldError("Please enter a valid email address");
      return;
    }

    setPending(true);
    setFormError(undefined);

    const result = await forgotPassword(email);

    setPending(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setRequested({ message: result.message, emailSent: result.emailSent });
  };

  if (requested !== null) {
    return (
      <div className="ap-anim-rise">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          {requested.emailSent ? "Email sent" : "Request received"}
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          {requested.emailSent ? (
            <>
              Check your <em className="font-light italic text-burnt">inbox</em>.
            </>
          ) : (
            <>
              Noted — <em className="font-light italic text-burnt">almost</em>.
            </>
          )}
        </h2>
        <p className="ap-body mt-4 text-ink/65" role="status">
          {requested.message}
        </p>

        <p className="ap-body mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-line pt-6 text-center text-sm text-ink/60">
          Remembered it?{" "}
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

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <p
          role="alert"
          className="ap-body mb-5 border border-burnt/40 bg-burnt-900 px-4 py-3 text-sm text-burnt-200"
        >
          {formError}
        </p>
      )}

      <div className="grid gap-5">
        <AuthField
          id="forgot-email"
          label="Email address"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            if (fieldError || formError) {
              setFieldError(undefined);
              setFormError(undefined);
            }
          }}
          error={fieldError}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="mt-7 w-full" withArrow disabled={pending}>
        {pending ? "Requesting…" : "Request reset link"}
      </Button>

      <p className="ap-body mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-line pt-6 text-center text-sm text-ink/60">
        Remembered it?{" "}
        <Link
          href="/login"
          className="ap-eyebrow text-burnt transition-colors duration-300 hover:text-burnt-400"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
