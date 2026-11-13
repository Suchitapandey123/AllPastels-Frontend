import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join AllPastels — save what you love, track every order and get first look at small-run releases.",
  robots: { index: false, follow: true },
};

const STEPS = [
  {
    number: "01",
    title: "Save what you love",
    detail: "A wishlist that follows you across devices, kept in sync with your bag.",
  },
  {
    number: "02",
    title: "First look at small runs",
    detail: "We make in limited quantities — members see new pieces before the drop.",
  },
  {
    number: "03",
    title: "A little something extra",
    detail: "Member-only offers, starting with 10% off your first order.",
  },
];

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Join AllPastels"
      title={
        <>
          Make yourself <em className="font-light italic text-burnt">at home</em>.
        </>
      }
      subtitle="One account for orders, wishlists and every saved address."
      story={{
        headline: (
          <>
            Made less.
            <br />
            <em className="font-light italic text-burnt-600">Loved longer.</em>
          </>
        ),
        body:
          "An account takes ten seconds and pays you back every time you check out, track a parcel or come back for the piece you bookmarked.",
      }}
      steps={STEPS}
    >
      <SignUpForm />
    </AuthShell>
  );
}
