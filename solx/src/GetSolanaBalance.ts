import {Commitment, Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js"


/**
 * 获取指定地址的 SOL 余额（单位：SOL）
 * @param conn Solana 连接实例
 * @param address 钱包地址（PublicKey 或字符串）
 * @returns 余额（单位 SOL）
 */
export async function GetSolanaBalance(
  conn: Connection,
  address: PublicKey | string,
  commitment: Commitment
): Promise<number> {
  try {
    const pubkey = typeof address === "string" ? new PublicKey(address) : address
    const lamports = await conn.getBalance(pubkey, commitment)
    return lamports / LAMPORTS_PER_SOL
  } catch (err) {
    console.error("Failed to fetch SOL balance:", err)
    throw err
  }
}