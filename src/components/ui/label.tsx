// src/components/ui/label.tsx
"use client";

import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

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
