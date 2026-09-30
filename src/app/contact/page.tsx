import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the AllPatels team about orders, sizing, returns or anything else. We reply within one working day.",
};

const CHANNELS = [
  {
    title: "Customer care",
    detail: "For orders, returns and anything after you buy.",
    value: "care@allpatels.com",
    href: "mailto:care@allpatels.com",
  },
  {
    title: "Wholesale & stockists",
    detail: "For retail partnerships and bulk enquiries.",
    value: "partners@allpatels.com",
    href: "mailto:partners@allpatels.com",
  },
  {
    title: "Studio hours",
    detail: "Monday to Saturday, 10am – 6pm IST.",
    value: "We reply within one working day",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-ash-50">
        <Container>
          <div className="py-14 sm:py-20">
            <Reveal variant="up">
              <p className="ap-eyebrow mb-4 flex items-center gap-3 text-burnt">
                <span aria-hidden="true" className="h-px w-8 bg-burnt/50" />
                Get in touch
              </p>
              <h1 className="text-[clamp(2.25rem,5vw,4rem)]">Contact us</h1>
              <p className="ap-body mt-5 max-w-xl text-ink/70">
                Sizing advice, an order question, or just want to know whether
                something will work for you — write to us. A real person reads
                every message.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section space="default" tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-20">
          <ContactForm />

          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            {CHANNELS.map((channel) => (
              <div key={channel.title} className="bg-ash-50 p-6">
                <h2 className="ap-eyebrow text-ink/50">{channel.title}</h2>
                <p className="ap-body mt-2 text-sm text-ink/65">{channel.detail}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="ap-body mt-3 block text-sm text-burnt underline underline-offset-4"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="ap-body mt-3 flex items-center gap-2 text-sm text-ink">
                    <CheckIcon className="h-4 w-4 shrink-0 text-ash-600" />
                    {channel.value}
                  </p>
                )}
              </div>
            ))}
          </aside>
        </div>
      </Section>
    </>
  );
}
