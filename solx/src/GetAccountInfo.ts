import { Connection, PublicKey, AccountInfo } from "@solana/web3.js"

/**
 * 获取某个账户的原始 AccountInfo（未解析的账户数据）
 * @param conn Solana 连接实例
 * @param address 钱包地址（PublicKey 或 string）
 * @returns 账户信息（AccountInfo）或 null
 */
export async function GetAccountInfo(
  conn: Connection,
  address: PublicKey | string
): Promise<AccountInfo<Buffer> | null> {
  try {
    const pubkey = typeof address === "string" ? new PublicKey(address) : address
    const info = await conn.getAccountInfo(pubkey, "confirmed")
    return info
  } catch (err) {
    console.error("Failed to get account info:", err)
    throw err
  }
}
