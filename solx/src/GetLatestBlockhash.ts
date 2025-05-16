import { Connection, BlockhashWithExpiryBlockHeight, Commitment } from "@solana/web3.js"

/**
 * 获取最新区块哈希及其过期高度信息
 * @param conn Solana 连接实例
 * @param commitment 
 * @returns 包含 blockhash 和过期高度的对象
 */
export async function getLatestBlockhash(
  conn: Connection,
  commitment: Commitment
): Promise<BlockhashWithExpiryBlockHeight> {
  try {
    const latest = await conn.getLatestBlockhash(commitment)
    return latest
  } catch (err) {
    console.error("Failed to get latest blockhash:", err)
    throw err
  }
}
