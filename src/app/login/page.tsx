import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your AllPastels account to see orders, saved addresses and the pieces you have kept for later.",
  robots: { index: false, follow: true },
};

const STEPS = [
  {
    number: "01",
    title: "Pick up where you left off",
    detail: "Your bag, wishlist and details are exactly as you left them.",
  },
  {
    number: "02",
    title: "Every order, one place",
    detail: "Delivery status, invoices and returns without hunting through email.",
  },
  {
    number: "03",
    title: "Checkout in one step",
    detail: "Saved addresses and sizes make the next order the quick one.",
  },
];

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Sign in"
      title={
        <>
          Welcome <em className="font-light italic text-burnt">back</em>.
        </>
      }
      subtitle="Good to see you again — your account is waiting."
      story={{
        headline: (
          <>
            The good stuff,
            <br />
            <em className="font-light italic text-burnt-600">remembered.</em>
          </>
        ),
        body:
          "Members keep their orders, addresses and saved pieces together — and see small-run drops before anyone else.",
      }}
      steps={STEPS}
    >
      <SignInForm />
    </AuthShell>
  );
}
