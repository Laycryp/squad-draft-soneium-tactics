// src/components/ui/Footer.tsx
"use client";

import React from "react";

// Tab type محلي (بس عشان نرضي أي imports قديمة)
export type Tab = "home" | "actions" | "context" | "wallet";

interface FooterProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

/**
 * Minimal stub footer.
 * نحن لا نستخدم هذا الـ Footer فعليًا في اللعبة،
 * لكن نتركه موجود لتجنّب أخطاء TypeScript و Next build.
 */
export const Footer: React.FC<FooterProps> = () => {
  return null;
};

export default Footer;
