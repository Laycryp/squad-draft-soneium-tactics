// src/game/web3.ts
import { ethers } from "ethers";
import { sdk } from "@farcaster/miniapp-sdk";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string | undefined;

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1946");

// RPC للقراءة فقط (view) – نستخدمه لـ player state / leaderboard
const RPC_URL =
  process.env.NEXT_PUBLIC_SONEIUM_RPC_URL ??
  "https://rpc.minato.soneium.org";

// ⚠️ ABI الجديد لعقد SquadDraftSoneiumTactics (الإصدار التراكمي)
// - getPlayer: يعيد بيانات اللاعب اليومية + السكور التراكمي
// - recordMatch: تسجّل نتيجة مباراة واحدة
export const GAME_ABI = [
  // getPlayer view – مطابق للعقد:
  // function getPlayer(address player)
  //  returns (uint64 lastPlayDay,uint8 attemptsToday,uint8 attemptsLeft,uint256 totalScore)
  "function getPlayer(address player) view returns (uint64 lastPlayDay,uint8 attemptsToday,uint8 attemptsLeft,uint256 totalScore)",

  // كتابة النتيجة التراكمية – نستخدم uint256[] للسكوادر (6 وحدات)
  "function recordMatch(uint256 score, uint256[] squadIds) external",
];

export type PlayerOnchainView = {
  lastPlayDay: number;
  attemptsToday: number;
  attemptsLeft: number;
  totalScore: number;
};

/**
 * قراءة حالة اللاعب من العقد عبر RPC (بدون محفظة)
 * تُستخدم في Profile/Leaderboard لعرض totalScore + المحاولات المتبقية.
 */
export async function getPlayerOnchainView(
  address: string
): Promise<PlayerOnchainView | null> {
  if (!address || !CONTRACT_ADDRESS) {
    return null;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, GAME_ABI, provider);

  const [lastPlayDayRaw, attemptsTodayRaw, attemptsLeftRaw, totalScoreRaw] =
    (await contract.getPlayer(address)) as [bigint, bigint, bigint, bigint];

  return {
    lastPlayDay: Number(lastPlayDayRaw),
    attemptsToday: Number(attemptsTodayRaw),
    attemptsLeft: Number(attemptsLeftRaw),
    totalScore: Number(totalScoreRaw),
  };
}

/**
 * إرسال نتيجة ماتش على السلسلة من داخل Farcaster Mini App.
 * - يستخدم sdk.wallet.getEthereumProvider للحصول على signer.
 * - يرجع txHash لو نجحت العملية.
 * - العقد الآن يسمح بـ 3 محاولات يوميًا، وكل score يُضاف تراكميًا.
 */
export async function submitMatchOnchain(
  score: number,
  squadIds: number[]
): Promise<string> {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      "Contract address not configured (NEXT_PUBLIC_CONTRACT_ADDRESS)."
    );
  }

  if (!Array.isArray(squadIds) || squadIds.length === 0) {
    throw new Error("Squad must not be empty.");
  }

  // ✅ مع ABI uint256[] نقدر نمرر رقم عادي (number[]) و ethers يتكفّل بالتحويل
  // فقط نتحقق من أنها قيم موجبة ومنطقية
  const normalizedSquad = squadIds.map((id) => {
    if (id < 0) {
      throw new Error(`Invalid unit id (negative): ${id}`);
    }
    return BigInt(id);
  });

  // ✅ الحصول على EIP-1193 provider من Farcaster Mini App SDK
  const ethProvider = await sdk.wallet.getEthereumProvider();
  const provider = new ethers.BrowserProvider(ethProvider as any);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, GAME_ABI, signer);

  // ملاحظة: العقد نفسه يفرض:
  // - 3 محاولات يومية
  // - squadIds.length == 6
  // - score > 0
  const tx = await contract.recordMatch(score, normalizedSquad);
  const receipt = await tx.wait();

  return receipt.hash;
}
