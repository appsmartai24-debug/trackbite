import { PageContainer } from "@/components/layout/PageContainer";
import { BackHeader } from "@/components/customer/BackHeader";
import { Card } from "@/components/ui/Card";

const SECTIONS = [
  {
    heading: "Information we collect",
    body: "When you create a Trackbite account we collect your name, email address, and the food preferences you share with us, such as dietary preference, allergies, portion preference, and food goals. When you visit a participating restaurant, before-and-after meal photos and feedback you submit are linked to your account.",
  },
  {
    heading: "How we use your information",
    body: "We use your profile to personalize your experience, let participating restaurants serve you safely and efficiently when you show your QR code, calculate loyalty rewards with each restaurant separately, and improve the Trackbite app.",
  },
  {
    heading: "Who can see your information",
    body: "Only a restaurant you personally show your QR code to can view your profile and eating history, and only for that visit. Trackbite does not sell your personal data to third parties.",
  },
  {
    heading: "Your choices",
    body: "You can review and update your preferences at any time from Profile > Update Preferences. You can request deletion of your account and associated data by contacting support.",
  },
  {
    heading: "Data retention",
    body: "We retain your account information for as long as your account is active. Meal photos and history are retained to power your rewards and preference history unless you request deletion.",
  },
  {
    heading: "Contact",
    body: "Questions about this policy can be sent to support@trackbite.app.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PageContainer size="md" className="flex flex-1 flex-col">
      <BackHeader title="Privacy Policy" />

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