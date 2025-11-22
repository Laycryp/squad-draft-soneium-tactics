"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * MiniAppReadyBeacon:
 * - يخبر Farcaster Mini App SDK أن الواجهة جاهزة للعرض.
 * - لا يرسم أي UI، مجرد hook.
 */
export function MiniAppReadyBeacon() {
  useEffect(() => {
    sdk.actions.ready().catch(console.error);
  }, []);

  return null;
}
