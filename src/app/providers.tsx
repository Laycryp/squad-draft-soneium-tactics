// src/app/providers.tsx
"use client";

import React from "react";
import { SafeFarcasterSolanaProvider } from "~/components/providers/SafeFarcasterSolanaProvider";
import { ANALYTICS_ENABLED, RETURN_URL } from "~/lib/constants";

// نضمن أن returnUrl دائمًا string (حتى لو مش موجود في env)
const SAFE_RETURN_URL: string = RETURN_URL ?? "";

// نضمن أن analyticsEnabled boolean
const SAFE_ANALYTICS_ENABLED: boolean = !!ANALYTICS_ENABLED;

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SafeFarcasterSolanaProvider
      returnUrl={SAFE_RETURN_URL}
      analyticsEnabled={SAFE_ANALYTICS_ENABLED}
    >
      {children}
    </SafeFarcasterSolanaProvider>
  );
}
