import { Commitment, Connection, PublicKey, RpcResponseAndContext, GetProgramAccountsResponse} from "@solana/web3.js"

/**
 * 根据token的mint和owner的地址，查询这个用户这个Token的账户（用户可以拥有多个token account）
 * @param conn Solana Connection 实例
 * @param owner Token 持有者地址
 * @param mint 指定的 Token Mint 地址
 * @returns 包含账户信息的数组
 */
export async function GetTokenAccountsByOwner(
  conn: Connection,
  owner: string | PublicKey,
  mint: string | PublicKey,
  commitment: Commitment,
): Promise<RpcResponseAndContext<GetProgramAccountsResponse>> {
  try {
    const ownerPubkey = typeof owner === "string" ? new PublicKey(owner) : owner
    const mintPubkey = typeof mint === "string" ? new PublicKey(mint) : mint

    const result = await conn.getTokenAccountsByOwner(ownerPubkey, {
      mint: mintPubkey,
    }, commitment);
    return result
  } catch (err) {
    console.error("Failed to get token accounts by owner:", err)
    throw err
  }
}
