import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a New Password",
  description:
    "Choose a new password for your AllPastels account and pick up right where you left off.",
  robots: { index: false, follow: true },
};

const STEPS = [
  {
    number: "01",
    title: "Use the link we sent",
    detail: "Reset links are personal and expire after fifteen minutes.",
  },
  {
    number: "02",
    title: "Eight characters or more",
    detail: "Mix it up a little — the meter beside the field keeps score.",
  },
  {
    number: "03",
    title: "Sign in again",
    detail: "Same account, same orders — only the password has changed.",
  },
];

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="New password"
      title={
        <>
          Pick a new <em className="font-light italic text-burnt">password</em>.
        </>
      }
      subtitle="One new password and everything is exactly where you left it."
      story={{
        headline: (
          <>
            Right back <em className="font-light italic text-burnt-600">where you left it</em>.
          </>
        ),
        body:
          "The same account, the same orders and the same saved pieces — no reset required anywhere else.",
      }}
      steps={STEPS}
    >
      {/* useSearchParams lives behind Suspense so the route still prerenders. */}
      <Suspense fallback={<p className="ap-eyebrow text-ink/45">Preparing your link…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
