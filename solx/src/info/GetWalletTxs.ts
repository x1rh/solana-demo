import { Connection, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js"

/**
 * 获取某个地址最近的交易签名列表
 * @param conn Solana Connection 实例
 * @param address 钱包地址（string 或 PublicKey）
 * @param limit 限制返回的交易数量，默认 10
 * @returns 最近的交易签名信息数组
 */
export async function GetWalletTxs(
  conn: Connection,
  address: string | PublicKey,
  limit: number = 10
): Promise<ConfirmedSignatureInfo[]> {
  try {
    const pubkey = typeof address === "string" ? new PublicKey(address) : address
    const signatures = await conn.getSignaturesForAddress(pubkey, { limit }, "confirmed")
    return signatures
  } catch (err) {
    console.error("Failed to fetch wallet transactions:", err)
    throw err
  }
}
