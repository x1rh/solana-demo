import { Connection, GetProgramAccountsResponse, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {GetSolanaBalance} from "./GetSolanaBalance"
import { GetTokenAccountsByMint } from "./GetProgramAccounts";
import { GetAccountInfo } from "./GetAccountInfo";
import { GetCurrentSlot } from "./GetCurrentSlot";
import { GetFirstAvailableBlock } from "./GetFirstAvailableBlock";
import { GetLatestBlockhash } from "./GetLatestBlockhash";
import { GetTokenAccountsByOwner } from "./GetTokenAccountsByOwner";
import { GetWalletTxs } from "./GetWalletTxs";

describe('test all getter', () => {
    const conn = new Connection("https://api.mainnet-beta.solana.com");

    it("test GetAccountInfo", async() => {
        // 获取已解析的账户详细信息
        const account = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
        const commitment = "confirmed";
        const accountInfo = await GetAccountInfo(conn, account, commitment);
        console.log("账户信息：", accountInfo)
    });

    it("test GetCurrentSlot", async() => {
        const slot = await GetCurrentSlot(conn, "finalized");
        console.log(`current slot: ${slot}`);
    })

    it("test GetFirstAvailableBlock", async() => {
        const blockNumber = await GetFirstAvailableBlock(conn);
        console.log(`first available block: ${blockNumber}`);
    })

    it("test GetLatestBlockhash", async() => {
        const blockHash = await GetLatestBlockhash(conn, "finalized");
        console.log(`latest block hash: ${blockHash.blockhash}`);
    })

    it("test GetProgramAccounts", async() => {
        // 不少服务商不支持这个接口
        const conn = new Connection("https://api.zan.top/node/v1/solana/mainnet/a0c44950863d4a4ca5fa05b315008c07");
        // 批量获取某个程序账户下的所有账户信息
        // 获取指定代币mint地址的所有这个token的持有者
        // const mintAddress = new PublicKey("9GGp9kRjoVFCYZ35wA19BuBkVeR5BBAjYpHehe5XPUMP")  
        const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump");
        const commitment = "finalized";
        const accounts = await GetTokenAccountsByMint(conn, mintAddress, commitment);
        console.log("前3个账户:",  accounts.slice(0, 10));
    })

    it("test GetSolanaBalance", async() => {
        const address = new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1");
        const commitment = "confirmed";
        const solanaBalance = await GetSolanaBalance(conn, address, commitment);
        console.log(`balance: ${solanaBalance}`);
    })

    it("test GetTokenAccountsByOwner", async() => {
        // 根据token的mint地址和用户的地址查询对应的所有token account
        const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
        const owner = new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2");
        const commitment = "finalized";
        const result = await GetTokenAccountsByOwner(conn, owner, usdcMint, commitment);
        console.log(`response: ${JSON.stringify(result)}\n`);
        const tokenAccounts = result.value;
        for(const account of tokenAccounts) {
            console.log(`token: ${usdcMint.toBase58()}, owner: ${owner.toBase58()}, token account: ${account.pubkey.toBase58()}`);
        }
    })

    it("test GetWalletTxs", async() => {
        // 获取某个钱包最近limit笔交易
        const wallet = new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2");
        const limit = 3;
        const signatures = await GetWalletTxs(conn, wallet, limit);
        console.log(`最近的3笔交易签名: ${JSON.stringify(signatures)}\n`);
        for(const tx of signatures) {
            console.log(tx);
        }
    })
})

