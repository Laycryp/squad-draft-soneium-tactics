// src/components/ui/wallet/SignSolanaMessage.tsx
"use client";

import React from "react";

export type SignSolanaMessageProps = {
  signMessage?: string;
};

/**
 * Stub component for the old Neynar Solana demo.
 * We don't need this in the Squad Draft mini app, so
 * we just return null to avoid TypeScript / build errors.
 */
export function SignSolanaMessage(_props: SignSolanaMessageProps) {
  return null;
}

export default SignSolanaMessage;
