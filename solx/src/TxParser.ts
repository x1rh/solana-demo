import { Commitment, Connection, ParsedTransactionWithMeta } from "@solana/web3.js"

/**
 * 解析指定交易哈希的 Solana Transaction
 * @param conn Solana Connection 实例
 * @param signature 交易哈希
 * @param version 最大支持的交易版本（默认 0）
 * @returns 解析后的交易对象，若不存在则返回 null
 */
export async function ParseTx(
  conn: Connection,
  signature: string,
  commitment: Commitment,
  version: number = 0
): Promise<ParsedTransactionWithMeta | null> {
  try {
    const parsedTx = await conn.getParsedTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: version,
    })

    return parsedTx
  } catch (err) {
    console.error("Failed to parse transaction:", err)
    throw err
  }
}
