// src/components/App.tsx
"use client";

import React, { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

type AppProps = {
  title?: string; // نستقبل العنوان من app/app.tsx حتى يرضى TypeScript
};

/**
 * Minimal App shell kept only so TypeScript & Next build don't fail.
 * We don't rely on @neynar/react here.
 * The actual game UI lives in src/app/page.tsx.
 */
export function App({ title }: AppProps) {
  // نرسل ready() مرة احتياطياً – لن يضر لو استُدعي أكثر من مرة
  useEffect(() => {
    sdk.actions.ready().catch(console.error);
  }, []);

  // العنوان لا نستخدمه هنا، الـ UI الرئيسي في page.tsx
  void title;

  return null;
}

export default App;
