import { Connection, PublicKey, TokenAccountsFilter } from "@solana/web3.js"

/**
 * 查询某个 owner 地址下指定 mint 的 Token 账户列表
 * @param conn Solana Connection 实例
 * @param owner Token 持有者地址
 * @param mint 指定的 Token Mint 地址
 * @returns 包含账户信息的数组
 */
export async function getTokenAccountsByOwner(
  conn: Connection,
  owner: string | PublicKey,
  mint: string | PublicKey
) {
  try {
    const ownerPubkey = typeof owner === "string" ? new PublicKey(owner) : owner
    const mintPubkey = typeof mint === "string" ? new PublicKey(mint) : mint

    const result = await conn.getTokenAccountsByOwner(ownerPubkey, {
      mint: mintPubkey,
    }, "confirmed")

    return result
  } catch (err) {
    console.error("Failed to get token accounts by owner:", err)
    throw err
  }
}
