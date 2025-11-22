"use client";

import React from "react";

type SafeFarcasterSolanaProviderProps = {
  children: React.ReactNode;
  returnUrl: string;
  analyticsEnabled: boolean;
};

/**
 * SafeFarcasterSolanaProvider (MVP version)
 *
 * في القالب الأصلي كان يلفّ children داخل FarcasterSolanaProvider
 * مع ربط سولانا. نحن لا نحتاج دعم سولانا في هذا المشروع الآن،
 * لذلك نبقي التوقيع كما هو لكن نعيد children مباشرة بدون أي منطق.
 */
export function SafeFarcasterSolanaProvider({
  children,
}: SafeFarcasterSolanaProviderProps) {
  return <>{children}</>;
}
