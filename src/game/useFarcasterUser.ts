// src/game/useFarcasterUser.ts
"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export type FarcasterUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type State = {
  user: FarcasterUser | null;
  loading: boolean;
  error: string | null;
};

export function useFarcasterUser(): State {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const ctx = (sdk as any)?.context;
      const rawUser = ctx?.user;

      if (rawUser) {
        // حاول تطبيع displayName و username لأي شكل محتمل
        const normalizeStr = (val: unknown): string | undefined => {
          if (typeof val === "string") return val;
          if (
            val &&
            typeof val === "object" &&
            "username" in (val as any) &&
            typeof (val as any).username === "string"
          ) {
            return (val as any).username as string;
          }
          if (
            val &&
            typeof val === "object" &&
            "displayName" in (val as any) &&
            typeof (val as any).displayName === "string"
          ) {
            return (val as any).displayName as string;
          }
          return undefined;
        };

        const fid: number =
          typeof rawUser.fid === "number" ? rawUser.fid : 0;

        const username = normalizeStr(rawUser.username);
        const displayName = normalizeStr(rawUser.displayName);
        const pfpUrl =
          typeof rawUser.pfpUrl === "string" ? rawUser.pfpUrl : undefined;

        setUser({
          fid,
          username,
          displayName,
          pfpUrl,
        });
        setError(null);
      } else {
        setError("No Farcaster user context (outside Mini App?).");
      }
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error ? e.message : "Failed to read Farcaster context."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
}
