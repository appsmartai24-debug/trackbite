"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { Card } from "@/components/ui/Card";
import { ChevronRightIcon } from "@/components/customer/icons";

const FAQS = [
  {
    question: "How does the QR code work?",
    answer:
      "Your QR code is your digital food ID. Show it to any participating restaurant and they can instantly see your preferences, allergies, and eating history to serve you better.",
  },
  {
    question: "Do my loyalty points transfer between restaurants?",
    answer:
      "No. Each restaurant keeps its own separate rewards wallet for you, with its own thresholds and rewards. Points earned at one restaurant stay with that restaurant.",
  },
  {
    question: "Why do I take a before and after photo?",
    answer:
      "The before and after photos help the restaurant understand portion sizes and reduce food waste, and they can trigger loyalty points once you finish your meal.",
  },
  {
    question: "How do I update my allergies or dietary preferences?",
    answer:
      "Go to Profile > Update Preferences. Any changes are shown to restaurants the next time they scan your QR code.",
  },
  {
    question: "Is my data shared with restaurants I haven't visited?",
    answer:
      "No. A restaurant only sees your profile after you show them your QR code and they scan it.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-trackbite-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-trackbite-gray-900">{question}</span>
        <ChevronRightIcon
          className={[
            "h-4 w-4 shrink-0 text-trackbite-gray-400 transition-transform",
            open ? "rotate-90" : "",
          ].join(" ")}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-trackbite-gray-500">{answer}</p>
      )}
    </div>
  );
}

export default function HelpSupportPage() {
  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <BackHeader title="Help & Support" />

      <Card padding="lg" className="mb-4">
        <h2 className="text-sm font-semibold text-trackbite-gray-900">Contact us</h2>
        <p className="mt-1 text-sm text-trackbite-gray-500">
          Can&apos;t find what you&apos;re looking for? Reach out and we&apos;ll get back to you.
        </p>
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <a
            href="mailto:support@trackbite.app"
            className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            support@trackbite.app
          </a>
          <a
            href="https://wa.me/"
            className="font-medium text-trackbite-green hover:text-trackbite-green-dark"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="mb-1 text-sm font-semibold text-trackbite-gray-900">
          Frequently asked questions
        </h2>
        <div>
          {FAQS.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
