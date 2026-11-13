import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your AllPastels password — enter your email and we will send a link to set a new one.",
  robots: { index: false, follow: true },
};

const STEPS = [
  {
    number: "01",
    title: "Enter your email",
    detail: "The address you sign in to AllPastels with.",
  },
  {
    number: "02",
    title: "Open the link",
    detail: "A reset link arrives by email and stays valid for fifteen minutes.",
  },
  {
    number: "03",
    title: "Choose a new password",
    detail: "Pick something new and you are straight back to your account.",
  },
];

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Reset password"
      title={
        <>
          Forgot your <em className="font-light italic text-burnt">password</em>?
        </>
      }
      subtitle="Happens to the best of us — enter your email and we will send a link to set a new one."
      story={{
        headline: (
          <>
            Take your time, <em className="font-light italic text-burnt-600">we’ll wait</em>.
          </>
        ),
        body:
          "Nothing moves while you sort this out — your bag, wishlist and saved addresses stay exactly where they are.",
      }}
      steps={STEPS}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
