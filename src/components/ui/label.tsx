// src/components/ui/label.tsx
"use client";

import * as React from "react";

// نفس الفكرة هنا: type بدل interface فارغة
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Minimal label wrapper.
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, ...props }, ref) => (
    <label ref={ref} {...props}>
      {children}
    </label>
  )
);

Label.displayName = "Label";

export default Label;
