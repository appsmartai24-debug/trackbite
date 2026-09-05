import { SVGProps } from "react";

export type IconComponent = (
  props: SVGProps<SVGSVGElement>
) => React.ReactElement;

export const HomeIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1V9.5" />
  </svg>
);

export const CameraIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 8a1 1 0 0 1 1-1h2.2l1-1.6A1 1 0 0 1 9.05 5h5.9a1 1 0 0 1 .85.4L16.8 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z" />
    <circle cx="12" cy="13" r="3.3" />
  </svg>
);

export const GiftIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="9" width="16" height="4" rx="1" />
    <path d="M5 13h14v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7Z" />
    <path d="M12 9v12" />
    <path d="M12 9c-1.5 0-4-.8-4-3a2.2 2.2 0 0 1 4-1.4C12 3 12 9 12 9Z" />
    <path d="M12 9c1.5 0 4-.8 4-3a2.2 2.2 0 0 0-4-1.4C12 3 12 9 12 9Z" />
  </svg>
);

export const UserIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.3-3.6 4.2-5.5 7.5-5.5s6.2 1.9 7.5 5.5" />
  </svg>
);

export const EditIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const SlidersIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 6h9" />
    <path d="M17 6h3" />
    <circle cx="14" cy="6" r="2.2" />
    <path d="M4 12h3" />
    <path d="M11 12h9" />
    <circle cx="8" cy="12" r="2.2" />
    <path d="M4 18h9" />
    <path d="M17 18h3" />
    <circle cx="14" cy="18" r="2.2" />
  </svg>
);

export const HelpIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9.2 9.3a2.8 2.8 0 1 1 4.4 2.3c-.9.6-1.6 1.1-1.6 2.3" />
    <circle
      cx="12"
      cy="17.2"
      r="0.8"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const ShieldIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3.5 5 6v6c0 4.5 3 7.4 7 8.5 4-1.1 7-4 7-8.5V6Z" />
    <path d="M9.3 12.2l1.9 1.9 3.5-3.7" />
  </svg>
);

export const DocumentIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 3.5h5.5L18 8v11.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
    <path d="M13.5 3.5V8H18" />
    <path d="M9.5 12.5h5" />
    <path d="M9.5 15.5h5" />
    <path d="M9.5 9.5h1.5" />
  </svg>
);

export const ChevronRightIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ChevronLeftIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const CheckIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const SparkleIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M11.05 2.8a1 1 0 0 1 1.9 0l1.35 3.98a4 4 0 0 0 2.47 2.47l3.98 1.35a1 1 0 0 1 0 1.9l-3.98 1.35a4 4 0 0 0-2.47 2.47l-1.35 3.98a1 1 0 0 1-1.9 0l-1.35-3.98a4 4 0 0 0-2.47-2.47L3.25 12.5a1 1 0 0 1 0-1.9l3.98-1.35a4 4 0 0 0 2.47-2.47Z" />
    <path d="M19 3.2a.6.6 0 0 1 1.14 0l.35 1.03c.14.4.45.71.85.85l1.03.35a.6.6 0 0 1 0 1.14l-1.03.35a1.4 1.4 0 0 0-.85.85l-.35 1.03a.6.6 0 0 1-1.14 0l-.35-1.03a1.4 1.4 0 0 0-.85-.85l-1.03-.35a.6.6 0 0 1 0-1.14l1.03-.35c.4-.14.71-.45.85-.85Z" />
  </svg>
);

export const QrIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
    <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
    <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
    <path d="M14.5 14.5h2.7v2.7" />
    <path d="M20.5 14.5v2.7h-2" />
    <path d="M14.5 20.5h3" />
    <path d="M20.5 20.5v-1.3" />
    <circle cx="6.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="6.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FlameIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2.5c1 2.5-2.5 4-2.5 7a2.5 2.5 0 0 0 5 0c1.2 1 2 2.6 2 4.3A6.5 6.5 0 0 1 5 13.5C5 8.5 9 6.5 12 2.5Z" />
  </svg>
);

export const ArrowRightIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowUpRightIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const LeafIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 19c-1-6 2-13 14-14 1 11-6 14-14 14Z" />
    <path d="M6.5 17.5C10 13.5 13 10.5 17.5 7" />
  </svg>
);

export const TrendingUpIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3.5 16 6-6 4 4 7-8" />
    <path d="M14.5 6h6v6" />
  </svg>
);

export const StarIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M12 2.75l2.6 5.6 6.15.7-4.6 4.2 1.25 6.1L12 16.4l-5.4 2.95 1.25-6.1-4.6-4.2 6.15-.7Z" />
  </svg>
);

export const LockIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const RefreshIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.5" />
    <path d="M20 4v4.5h-4.5" />
    <path d="M20 12a8 8 0 0 1-13.66 5.66L4 15.5" />
    <path d="M4 20v-4.5h4.5" />
  </svg>
);

export const ImagePlusIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <circle cx="9" cy="10" r="1.75" />
    <path d="m4 17 4.5-4.5a1.5 1.5 0 0 1 2.12 0L14 15.9" />
    <path d="M15 13.5 17.4 11a1.5 1.5 0 0 1 2.12 0L21 12.5" />
  </svg>
);

export const XIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CoinIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.2v9.6" />
    <path d="M14.6 9.3c-.4-.85-1.35-1.4-2.6-1.4-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2c1.6.3 2.6.9 2.6 2.1s-1.1 2-2.6 2c-1.25 0-2.2-.55-2.6-1.4" />
  </svg>
);

export const GiftBoxSmallIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="9" width="16" height="4" rx="1" />
    <path d="M5 13h14v6.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V13Z" />
    <path d="M12 9v11.5" />
  </svg>
);

export const LogOutIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3" />
    <path d="M16 17l4-5-4-5" />
    <path d="M20 12H9" />
  </svg>
);

export const TargetIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);

export const AlertIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3.5 21 19.5H3L12 3.5Z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="16.7" r="0.6" fill="currentColor" />
  </svg>
);

export const BowlIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3.5 12h17a7.5 6 0 0 1-17 0Z" />
    <path d="M6.5 12V8" />
    <path d="M17.5 12V8" />
  </svg>
);

export const PhoneIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" />
  </svg>
);

export const MapPinIcon: IconComponent = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);