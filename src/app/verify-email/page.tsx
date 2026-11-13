import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description:
    "Confirm your AllPastels email address to unlock orders, wishlists and members-only drops.",
  robots: { index: false, follow: true },
};

const STEPS = [
  {
    number: "01",
    title: "Open the link we sent",
    detail: "Every verification link is personal, single-use and expires after a day.",
  },
  {
    number: "02",
    title: "One tap confirms it",
    detail: "No passwords, no forms — the link itself is the proof.",
  },
  {
    number: "03",
    title: "Sign in again",
    detail: "Same account, same orders — now fully unlocked.",
  },
];

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="Verify email"
      title={
        <>
          One tap and you’re <em className="font-light italic text-burnt">in</em>.
        </>
      }
      subtitle="Confirm the email on your new account and everything opens up."
      story={{
        headline: (
          <>
            Made less.
            <br />
            <em className="font-light italic text-burnt-600">Loved longer.</em>
          </>
        ),
        body:
          "Verified members track every parcel, keep wishlists in sync across devices and see small-run drops before anyone else.",
      }}
      steps={STEPS}
    >
      {/* useSearchParams lives behind Suspense so the route still prerenders. */}
      <Suspense fallback={<p className="ap-eyebrow text-ink/45">Preparing your link…</p>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthShell>
  );
}
