import { Connection, PublicKey, RpcResponseAndContext, TokenAmount } from "@solana/web3.js"

/**
 * 获取指定 Token Account 的余额信息
 * @param conn Solana RPC 连接实例
 * @param tokenAccountAddress SPL Token 的账户地址（非 owner 地址）
 * @returns TokenAmount 对象，包含 amount 和 uiAmount 等
 */
export async function GetTokenBalance(
  conn: Connection,
  tokenAccountAddress: string | PublicKey
): Promise<TokenAmount> {
  try {
    const pubkey = typeof tokenAccountAddress === "string"
      ? new PublicKey(tokenAccountAddress)
      : tokenAccountAddress

    const result = await conn.getTokenAccountBalance(pubkey)
    return result.value
  } catch (err) {
    console.error("Failed to fetch token balance:", err)
    throw err
  }
}
