// src/components/ui/Share.tsx
"use client";

import React from "react";
import { Button } from "./Button";
import { APP_URL } from "~/lib/constants";

type ShareProps = {
  text?: string;
};

/**
 * Minimal stub Share component.
 * We don't rely on @neynar/react or useMiniApp here.
 * The actual share logic for the game lives inside ResultScreen
 * (copy to clipboard with the user's score).
 */
export const Share: React.FC<ShareProps> = ({ text }) => {
  // حتى لا يعتبر APP_URL أو text غير مستخدمين
  void APP_URL;
  void text;

  // لا نعرض شيء، فقط نمنع كسر أي imports قديمة
  return null;
};

export default Share;
