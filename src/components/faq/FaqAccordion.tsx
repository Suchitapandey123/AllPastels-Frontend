"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * FaqAccordion — accessible disclosure list.
 *
 * Uses a button with `aria-expanded` and `aria-controls` rather than
 * <details> so the open/close state can be styled and animated. The answer
 * panel is hidden when collapsed, which is what screen readers expect.
 */

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const GROUPS: { id: string; title: string; items: FaqItem[] }[] = [
  {
    id: "shipping",
    title: "Shipping",
    items: [
      {
        id: "shipping-times",
        question: "How long does delivery take?",
        answer:
          "Orders ship within 24 hours on working days. Standard delivery takes 3–6 working days across India. You will receive a tracking link by email as soon as your order leaves us.",
      },
      {
        id: "shipping-cost",
        question: "Is shipping free?",
        answer:
          "Shipping is complimentary on every order over ₹2,999. Below that it is a flat ₹99 regardless of how many items you order.",
      },
      {
        id: "shipping-international",
        question: "Do you ship internationally?",
        answer:
          "Not yet. We currently deliver within India only, and are working through the requirements for international shipping. Join the newsletter to hear when that changes.",
      },
    ],
  },
  {
    id: "tracking",
    title: "Tracking your order",
    items: [
      {
        id: "tracking-link",
        question: "Where is my tracking link?",
        answer:
          "A tracking link is emailed the moment your parcel is picked up. If it has not arrived within 24 hours, check your spam folder or contact us with your order number.",
      },
      {
        id: "tracking-change",
        question: "Can I change my delivery address?",
        answer:
          "Yes, if your order has not been dispatched. Contact us as quickly as possible and we will update it. Once a parcel has left our studio we cannot redirect it.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    items: [
      {
        id: "returns-window",
        question: "What is your returns policy?",
        answer:
          "You have 15 days from delivery to return anything unworn, unwashed and with its tags attached. Returns are free, and we refund to the original payment method within 5–7 working days of receiving the parcel.",
      },
      {
        id: "returns-exchange",
        question: "Can I exchange for a different size?",
        answer:
          "Yes. In most cases we can exchange a size for you — contact us with your order number and the size you need, and we will arrange it. If the size is out of stock we will offer a credit instead.",
      },
      {
        id: "returns-sale",
        question: "Can I return a sale item?",
        answer:
          "Yes. Sale items follow exactly the same returns policy as full-price pieces. The discount is preserved on your refund.",
      },
    ],
  },
  {
    id: "sizing",
    title: "Sizing & fit",
    items: [
      {
        id: "sizing-what-size",
        question: "How do your sizes run?",
        answer:
          "Our apparel runs true to standard Indian sizing. Every product page lists the exact garment measurements in centimetres — if you are between sizes, we recommend sizing up for knitwear and staying true for woven pieces.",
      },
      {
        id: "sizing-help",
        question: "I am between two sizes. What should I do?",
        answer:
          "Message us with your measurements and the piece you are looking at. We will tell you exactly which way to go based on how that specific garment is cut. It is far better to ask than to return.",
      },
    ],
  },
  {
    id: "gifting",
    title: "Gifting",
    items: [
      {
        id: "gifting-wrapping",
        question: "Is gift wrapping included?",
        answer:
          "Always, and at no extra cost. Choose gift wrapping at checkout and we will wrap the piece in recycled paper with a handwritten note if you would like one.",
      },
      {
        id: "gifting-note",
        question: "Can I add a personal note?",
        answer:
          "Yes. Add your message at checkout and we will write it by hand on an AllPatels card. Let us know in your message if you would prefer us to leave the price off.",
      },
    ],
  },
  {
    id: "fabric",
    title: "Fabric & care",
    items: [
      {
        id: "fabric-shrink",
        question: "Will my linen or cotton shrink?",
        answer:
          "Natural fibres can relax slightly with the first few washes. Follow the care instructions on your product page — cold gentle wash and line drying will keep shrinkage to a minimum.",
      },
      {
        id: "fabric-pilling",
        question: "How do I stop pilling?",
        answer:
          "Turn garments inside out and wash them with similar colours. A lint roller after every few wears keeps knitwear looking new, and washing less often helps more than anything else.",
      },
    ],
  },
  {
    id: "terms",
    title: "Policies",
    items: [
      {
        id: "terms-privacy",
        question: "What happens to my data?",
        answer:
          "We only collect what we need to fulfil your order, and never sell your details to anyone. Payment information is handled entirely by our payment provider and never touches our servers.",
      },
      {
        id: "terms-terms",
        question: "Where are your terms?",
        answer:
          "By placing an order you agree to our standard terms of sale, which cover pricing, delivery timelines, returns and warranty. The key points are all covered on this page.",
      },
    ],
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-12">
      {GROUPS.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-28">
          <h2 className="ap-eyebrow mb-6 border-b border-line pb-4 text-burnt">{group.title}</h2>

          <ul className="flex flex-col">
            {group.items.map((item) => {
              const isOpen = open === item.id;
              const panelId = `${item.id}-panel`;

              return (
                <li key={item.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-burnt"
                    >
                      <span className="text-base text-ink sm:text-lg">{item.question}</span>
                      <ChevronDownIcon
                        className={cn(
                          "h-4 w-4 shrink-0 text-ink/50 transition-transform duration-500",
                          isOpen && "rotate-180 text-burnt",
                        )}
                      />
                    </button>
                  </h3>

                  <div id={panelId} role="region" hidden={!isOpen} className="pb-6 pr-8">
                    <p className="ap-body max-w-2xl text-ink/70">{item.answer}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
