// src/components/ui/Header.tsx
"use client";

import React from "react";
import { APP_NAME } from "~/lib/constants";

type HeaderProps = {
  neynarUser?: {
    username?: string;
    displayName?: string;
  };
};

/**
 * Minimal stub header.
 * نحن لا نستخدم هذا الـ Header فعليًا في لعبة Squad Draft،
 * لأن الـ UI الرئيسي والهيدر مبنيين داخل src/app/page.tsx.
 * نترك هذا الملف موجود فقط حتى لا يكسر قوالب Neynar القديمة
 * وأي imports تعتمد عليه.
 */
export const Header: React.FC<HeaderProps> = () => {
  // فقط حتى لا يعتبر APP_NAME غير مستخدم
  void APP_NAME;

  return null;
};

export default Header;
