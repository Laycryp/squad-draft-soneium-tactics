// src/components/ui/Button.tsx
"use client";

import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

/**
 * Minimal generic button.
 * نستخدمه فقط كمكوّن بسيط، بدون أي اعتماد على neynar/react.
 */
export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

export default Button;
