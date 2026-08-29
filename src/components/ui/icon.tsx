import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  blueprint: (
    <>
      <path d="M9 5h12M9 12h12M9 19h12" />
      <circle cx="4.5" cy="5" r="1.4" />
      <circle cx="4.5" cy="12" r="1.4" />
      <circle cx="4.5" cy="19" r="1.4" />
    </>
  ),
  market: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </>
  ),
  competitors: (
    <>
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" />
    </>
  ),
  customers: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 20c.7-3.5 3-5.5 5.5-5.5s4.8 2 5.5 5.5" />
      <path d="M15.5 5a3.5 3.5 0 0 1 0 6.2M18 14.8c1.4.9 2.3 2.4 2.6 5.2" />
    </>
  ),
  "business-model": (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  product: (
    <>
      <path d="M5 8l7-4 7 4v8l-7 4-7-4V8z" />
      <path d="M5 8l7 4 7-4M12 12v8" />
    </>
  ),
  mvp: (
    <>
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z" />
    </>
  ),
  technology: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  roadmap: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
      <path d="M6.6 12h3.8M13.6 12h3.8" />
    </>
  ),
  marketing: (
    <>
      <path d="M3 17l3-3m0 0-3-3m3 3h13" />
    </>
  ),
  launch: (
    <>
      <path d="M9 3h6M12 3v5M8 8h8v3l1.5 4.5H6.5L8 8z" />
      <path d="M6.5 15.5l1.5 3.5M17.5 15.5l-1.5 3.5M10 19h4" />
    </>
  ),
  cofounder: (
    <>
      <path d="M12 3a3 3 0 0 0-3 3c0 1.1.6 2 1.5 2.5A3 3 0 0 0 8 12a3 3 0 0 0 3 3c-1.5 1.5-2.5 3.6-2.5 6" />
      <path d="M12 3a3 3 0 0 1 3 3c0 1.1-.6 2-1.5 2.5A3 3 0 0 1 16 12a3 3 0 0 1-3 3c1.5 1.5 2.5 3.6 2.5 6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.03 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  chevron: <path d="M9 18l6-6-6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  dots: (
    <>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 15.5,
  className,
  strokeWidth = 1.7,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}