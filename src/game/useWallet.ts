// src/game/useWallet.ts
"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { ethers } from "ethers";

export type WalletState = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  connecting: boolean;
  error: string | null;
  // تبقى الدوال موجودة لنفس الواجهة، لكن الآن تعمل مع Farcaster wallet
  connect: () => Promise<void>;
  disconnect: () => void;
};

/**
 * useWallet (Farcaster Mini App)
 *
 * - يحاول الاتصال تلقائيًا بـ Farcaster embedded wallet عند التحميل.
 * - لا يعتمد على window.ethereum.
 * - مناسب لتشغيل الميني آب داخل Warpcast.
 */
export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;

  const doConnect = async () => {
    try {
      setConnecting(true);
      setError(null);

      // الحصول على EIP-1193 provider من Farcaster Mini App SDK
      const ethProvider = await sdk.wallet.getEthereumProvider();

      const provider = new ethers.BrowserProvider(ethProvider as any);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const network = await provider.getNetwork();

      setAddress(addr);
      setChainId(Number(network.chainId.toString()));
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to access Farcaster wallet.";
      setError(msg);
      setAddress(null);
      setChainId(null);
    } finally {
      setConnecting(false);
    }
  };

  // اتصال تلقائي عند تحميل الميني آب
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setConnecting(true);
        const ethProvider = await sdk.wallet.getEthereumProvider();
        if (!ethProvider) {
          setError("Mini App wallet not available.");
          return;
        }
        const provider = new ethers.BrowserProvider(ethProvider as any);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const network = await provider.getNetwork();

        if (cancelled) return;
        setAddress(addr);
        setChainId(Number(network.chainId.toString()));
        setError(null);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          const msg =
            err instanceof Error
              ? err.message
              : "Unable to access Farcaster wallet.";
          setError(msg);
        }
      } finally {
        if (!cancelled) {
          setConnecting(false);
        }
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  const disconnect = () => {
    // ما نقدر نفصل محفظة فاركاستر فعليًا، فقط ننظف الحالة المحلية
    setAddress(null);
    setChainId(null);
    setError(null);
  };

  return {
    address,
    chainId,
    isConnected,
    connecting,
    error,
    connect: doConnect,
    disconnect,
  };
}
