"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthField, FieldAction } from "@/components/auth/AuthField";
import { StrengthMeter } from "@/components/auth/StrengthMeter";
import { Button } from "@/components/ui/Button";
import { passwordStrength } from "@/lib/auth";
import { resetPassword } from "@/api";

/**
 * ResetPasswordForm — step two of the password-reset flow.
 *
 * Reads the single-use `token` from the reset link (an `email` query param
 * is tolerated for older links but is not needed — the backend resolves the
 * account from the token), then sets a new password through the backend.
 * Three outcomes, each a complete state rather than a toast: a missing
 * link, a validation or backend error on the form, and a success panel that
 * briefly confirms the change before redirecting to sign in. The token is
 * sent only to the backend — never logged or rendered.
 */

interface FieldErrors {
  password?: string;
  confirm?: string;
  form?: string;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const linkComplete = Boolean(token);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  // Let the success panel be read, then hand the visitor back to sign in.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => router.replace("/login"), 2500);
    return () => clearTimeout(timer);
  }, [done, router]);

  const clearError = (key: keyof FieldErrors) =>
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const found: FieldErrors = {};
    if (passwordStrength(password) < 2) {
      found.password = "Choose something longer — 8 characters or more";
    }
    if (confirm !== password) found.confirm = "Both passwords need to match";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);
    setErrors({});

    const result = await resetPassword(token, password);

    setPending(false);

    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    setDone(true);
  };

  /* ------------------------------------------------------------ No link */
  if (!linkComplete) {
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
          Reset links are personal and expire after fifteen minutes — request a
          fresh one and you will be straight back in.
        </p>
        <Button
          href="/forgot-password"
          variant="primary"
          size="lg"
          className="mt-7 w-full"
          withArrow
        >
          Request a new link
        </Button>
      </div>
    );
  }

  /* ---------------------------------------------------------- Success */
  if (done) {
    return (
      <div className="ap-anim-rise">
        <p className="ap-eyebrow flex items-center gap-3 text-burnt">
          <span aria-hidden="true" className="h-px w-6 bg-burnt/50" />
          Password updated
        </p>
        <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.1rem)]">
          All set — you’re <em className="font-light italic text-burnt">back in</em>.
        </h2>
        <p className="ap-body mt-4 text-ink/65">
          Your new password is live. Orders, addresses and every saved piece are
          exactly where you left them. Taking you to sign in…
        </p>
        <Button href="/login" variant="primary" size="lg" className="mt-7 w-full" withArrow>
          Sign in now
        </Button>
      </div>
    );
  }

  /* ------------------------------------------------------------- Form */
  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.form && (
        <p
          role="alert"
          className="ap-body mb-5 border border-burnt/40 bg-burnt-900 px-4 py-3 text-sm text-burnt-200"
        >
          {errors.form}{" "}
          <Link href="/forgot-password" className="underline underline-offset-4">
            Request a new link
          </Link>
        </p>
      )}

      <div className="grid gap-5">
        <div>
          <AuthField
            id="reset-password"
            label="New password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(value) => {
              setPassword(value);
              clearError("password");
            }}
            error={errors.password}
            autoComplete="new-password"
            placeholder="••••••••"
            trailing={
              <FieldAction active={showPassword} onClick={() => setShowPassword((on) => !on)}>
                {showPassword ? "Hide" : "Show"}
              </FieldAction>
            }
          />
          <StrengthMeter value={password} />
        </div>
        <AuthField
          id="reset-confirm"
          label="Confirm new password"
          type={showPassword ? "text" : "password"}
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            clearError("confirm");
          }}
          error={errors.confirm}
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="mt-7 w-full" withArrow disabled={pending}>
        {pending ? "Setting your password…" : "Set new password"}
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
