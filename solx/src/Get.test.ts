import { Connection } from "@solana/web3.js";
import { getData, getWalletSolanaBalance, parseRawData } from "./ParseRawData"
import { GetTokenBalance } from "./TokenBalance";
import { getTokenAccountsByMint } from "./GetProgramAccounts";

describe('read data from chain', () => {
    const conn = new Connection("https://api.mainnet-beta.solana.com");

    it('get wallet solana balance', () => {
        getWalletSolanaBalance();
    })

    it('get data', () => {
        getData();
    })

    it('parse raw data from tx', () => {
        parseRawData();
    })

    it("test get token balance", () => {
        const result = await GetTokenBalance(conn);
        console.log(`token account detail: ${JSON.stringify(tokenAccountBalance)}`);
    })

    it("test get account info", () => {
        // 获取已解析的账户详细信息
        const accountInfo = await conn.getAccountInfo(new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj'), "confirmed");
        console.log("账户信息：", accountInfo)
    })

    it("test get account", () => { 
        // 批量获取某个程序账户下的所有账户信息
        // 获取代币mint地址为Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump的所有持有者
        const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump")
        const accounts = getTokenAccountsByMint(mintAddress);
        console.log("前3个账户:",  accounts.slice(0, 3));
    })

    it("test get token accounts by owner", () => { 
        // 用于查询某个账户下所有的代币账户 
        const tokenAccountsByOwner = await conn.getTokenAccountsByOwner(
            new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), 
            {
                mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
            }, 
            "confirmed",
        );
        console.log(`token账户: ${JSON.stringify(tokenAccountsByOwner)}\n`);
    })

    it("test get wallet txs", () => {
        // 获取某个钱包最近limit笔交易
        const signatures = await conn.getSignaturesForAddress(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
            limit: 3
        });
        console.log(`最近的3笔交易签名: ${JSON.stringify(signatures)}\n`);
    })
})


// export async function GetSolanaBalance(conn: Connection, publicKey: PublicKey) {
//    // const conn = new Connection("https://api.mainnet-beta.solana.com", "finalized") 
//    // const publicKey = new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1");
//    const balance = await conn.getBalance(publicKey);
//    console.log(`balance: ${balance / LAMPORTS_PER_SOL}`)
// }