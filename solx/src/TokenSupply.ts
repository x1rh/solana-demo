import { Connection, PublicKey, TokenAmount } from "@solana/web3.js"

/**
 * 获取指定 SPL Token 的总供应量
 * @param conn Solana Connection 实例
 * @param mint Token 的 mint 地址（string 或 PublicKey）
 * @returns Token 总供应量信息（含 decimals, amount 等）
 */
export async function getTokenSupply(
  conn: Connection,
  mint: string | PublicKey
): Promise<TokenAmount> {
  try {
    const mintPubkey = typeof mint === "string" ? new PublicKey(mint) : mint
    const supplyInfo = await conn.getTokenSupply(mintPubkey)
    return supplyInfo.value
  } catch (err) {
    console.error("Failed to fetch token supply:", err)
    throw err
  }
}
