import { Connection } from "@solana/web3.js"

/**
 * 获取当前 RPC 可访问的第一个区块编号
 * @param conn Solana 连接实例
 * @returns 首个可用区块编号
 */
export async function GetFirstAvailableBlock(conn: Connection): Promise<number> {
  try {
    const block = await conn.getFirstAvailableBlock()
    return block
  } catch (err) {
    console.error("Failed to get first available block:", err)
    throw err
  }
}
