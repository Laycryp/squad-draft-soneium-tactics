// src/components/ui/input.tsx
"use client";

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Minimal input wrapper.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <input ref={ref} {...props} />
);

Input.displayName = "Input";

export default Input;
