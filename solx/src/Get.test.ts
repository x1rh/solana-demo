import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {GetSolanaBalance} from "./GetSolanaBalance"
import { GetTokenAccountsByMint } from "./GetProgramAccounts";
import { GetAccountInfo } from "./GetAccountInfo";
import { GetWalletTxs } from "./GetWalletTxs";

describe('test all getter', () => {
    const conn = new Connection("https://api.mainnet-beta.solana.com");

    it("test GetAccountInfo", async() => {
        // 获取已解析的账户详细信息
        const account = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
        const commitment = "confirmed";
        const accountInfo = await GetAccountInfo(conn, commitment);
        console.log("账户信息：", accountInfo)
    });

    it("test GetCurrentSlot", async() => {

    })

    it("test GetFirstAvailableBlock", async() => {

    })

    it("test GetLatestBlockhash", async() => {

    })

    it("test GetProgramAccounts", async() => {
        // 批量获取某个程序账户下的所有账户信息
        // 获取代币mint地址为Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump的所有持有者
        const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump")
        const accounts = await GetTokenAccountsByMint(conn, mintAddress);
        console.log("前3个账户:",  accounts.slice(0, 3));
    })

    it("test GetSolanaBalance", async() => {
        const address = new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1");
        const commitment = "confirmed";
        const solanaBalance = await GetSolanaBalance(conn, address, commitment);
        console.log(`balance: ${solanaBalance / LAMPORTS_PER_SOL}`)
    })

    it("test GetTokenAccountsByOwner", async() => {
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

    it("test GetWalletTxs", async() => {
        // 获取某个钱包最近limit笔交易
        const wallet = new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2");
        const limit = 3;
        const signatures = GetWalletTxs(conn, wallet, limit);
        console.log(`最近的3笔交易签名: ${JSON.stringify(signatures)}\n`);
    })
})

