// src/components/ui/input.tsx
"use client";

import * as React from "react";

// نستخدم type بدل interface بدون أعضاء
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Minimal input wrapper.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <input ref={ref} {...props} />
);

Input.displayName = "Input";

export default Input;
