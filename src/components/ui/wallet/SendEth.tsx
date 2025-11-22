// src/components/ui/wallet/SendEth.tsx
"use client";

import React from "react";

export type SendEthProps = {
  to?: string;
};

/**
 * Stub component for the old Neynar wallet demo (SendEth).
 * We don't use this in the Squad Draft Soneium Tactics mini app,
 * so we simply return null to avoid TypeScript / build errors.
 */
export function SendEth(_props: SendEthProps) {
  return null;
}

export default SendEth;
