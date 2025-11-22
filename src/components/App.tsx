// src/components/App.tsx
"use client";

import React, { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Minimal App shell kept only so TypeScript & Next build don't fail.
 * We don't rely on @neynar/react here.
 * The actual UI lives in src/app/page.tsx.
 */
export function App() {
  // نرسل ready() مرة احتياطياً – لن يضر لو استُدعي أكثر من مرة
  useEffect(() => {
    sdk.actions.ready().catch(console.error);
  }, []);

  // لا نرسم أي شيء هنا لأن الـ UI الرئيسي في page.tsx
  return null;
}

export default App;
