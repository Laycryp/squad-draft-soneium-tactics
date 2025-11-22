// src/components/ui/wallet/SignEvmMessage.tsx
"use client";

import React from "react";

export type SignEvmMessageProps = {
  signMessage?: string;
};

/**
 * Stub component for the old Neynar EVM sign-message demo.
 * We don't use this in the Squad Draft mini app, so
 * we just return null to avoid TypeScript / build errors.
 */
export function SignEvmMessage(_props: SignEvmMessageProps) {
  return null;
}

export default SignEvmMessage;
