"use client";

import dynamic from "next/dynamic";
import { ANALYTICS_ENABLED, RETURN_URL } from "~/lib/constants";

const SafeFarcasterSolanaProvider = dynamic(
  () =>
    import("~/components/providers/SafeFarcasterSolanaProvider").then(
      (m) => m.SafeFarcasterSolanaProvider
    ),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeFarcasterSolanaProvider
      returnUrl={RETURN_URL}
      analyticsEnabled={ANALYTICS_ENABLED}
    >
      {children}
    </SafeFarcasterSolanaProvider>
  );
}
