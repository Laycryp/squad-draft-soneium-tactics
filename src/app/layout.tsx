import type { Metadata } from "next";

import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { APP_NAME, APP_DESCRIPTION } from "~/lib/constants";
import { MiniAppReadyBeacon } from "~/app/miniapp-ready";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* يخبر Farcaster أن الميني آب جاهزة */}
          <MiniAppReadyBeacon />
          {children}
        </Providers>
      </body>
    </html>
  );
}
