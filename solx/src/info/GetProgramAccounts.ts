import { Connection, PublicKey, ParsedAccountData, AccountInfo, Commitment } from "@solana/web3.js"

/**
 * 获取指定 mint 地址下的所有 SPL Token 持有者账户（getParsedProgramAccounts）
 * @param conn Solana 连接实例
 * @param mintAddress Token 的 Mint 地址（string 或 PublicKey）
 * @returns 所有符合条件的账户（已解析）
 */
export async function GetTokenAccountsByMint(
  conn: Connection,
  mintAddress: string | PublicKey,
  commitment: Commitment = "finalized",
): Promise<Array<{
  pubkey: PublicKey;
  account: AccountInfo<Buffer | ParsedAccountData>;
}>> {
  try {
    const mint = typeof mintAddress === "string" ? new PublicKey(mintAddress) : mintAddress;
    const tokenProgramId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    const accounts = await conn.getParsedProgramAccounts(tokenProgramId, {
      commitment: commitment, 
      filters: [
        {
          dataSize: 165, // SPL Token账户固定大小
        },
        {
          memcmp: {
            offset: 0, // Mint 地址在账户数据中的偏移位置
            bytes: mint.toBase58(),
          },
        },
      ],
    });
    return accounts;
  } catch (err) {
    console.error("Failed to fetch token accounts by mint:", err);
    throw err;
  }
}
