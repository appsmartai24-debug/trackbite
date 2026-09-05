import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { Card } from "@/components/ui/Card";

const SECTIONS = [
  {
    heading: "1. Acceptance of terms",
    body: "By creating a Trackbite account and using the app, you agree to these terms. If you don't agree, please don't use Trackbite.",
  },
  {
    heading: "2. Your account",
    body: "You're responsible for keeping your login credentials secure and for the accuracy of the profile information you provide, including allergies and dietary preferences.",
  },
  {
    heading: "3. Your QR code",
    body: "Your QR code is unique to your account and acts as your digital food identity. Only share it with restaurants you trust. Trackbite is not responsible for how a restaurant uses information after you choose to show them your code.",
  },
  {
    heading: "4. Loyalty rewards",
    body: "Each participating restaurant runs its own independent loyalty programme. Point thresholds, rewards, and redemption rules are set by each restaurant and may change at any time.",
  },
  {
    heading: "5. Meal photos and feedback",
    body: "Photos and feedback you submit are used to help restaurants reduce food waste and improve your experience. Don't upload content that isn't related to your meal.",
  },
  {
    heading: "6. Acceptable use",
    body: "Don't misuse the app, attempt to access another user's account, or interfere with the service.",
  },
  {
    heading: "7. Changes to these terms",
    body: "We may update these terms from time to time. Continued use of the app after a change means you accept the updated terms.",
  },
  {
    heading: "8. Contact",
    body: "Questions about these terms can be sent to support@trackbite.app.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <BackHeader title="Terms & Conditions" />

      <Card padding="lg" className="flex flex-col gap-6">
        <p className="text-xs text-trackbite-gray-400">Last updated: February 2026</p>

        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="text-sm font-semibold text-trackbite-gray-900">{section.heading}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-trackbite-gray-600">
              {section.body}
            </p>
          </div>
        ))}
      </Card>
    </PageContainer>
  );
}