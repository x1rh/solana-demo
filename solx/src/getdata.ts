import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js"
import BN  from "bn.js";


export async function getWalletSolanaBalance() {
   const conn = new Connection("https://api.mainnet-beta.solana.com", "finalized") 
   const publicKey = new PublicKey("CXPeim1wQMkcTvEHx9QdhgKREYYJD8bnaCCqPRwJ1to1");
   const balance = await conn.getBalance(publicKey);
   console.log(`balance: ${balance / LAMPORTS_PER_SOL}`)
}


export async function getData() {
    const conn = new Connection("https://api.mainnet-beta.solana.com");
   
    // 获取当前slot
    const slot = await conn.getSlot();
    console.log(`current slot: ${slot}`);

    // 获取token账户余额
    const tokenAccountBalance = await conn.getTokenAccountBalance(new PublicKey("HGtAdvmncQSk59mAxdh2M7GTUq1aB9WTwh7w7LwvbTBT"));
    console.log(`token account detail: ${JSON.stringify(tokenAccountBalance)}`);

    // 获取当前RPC的首个可用区块
    const firstAvailableBlock = await conn.getFirstAvailableBlock();
    console.log(`首个可用区块: ${firstAvailableBlock}\n`);

    // 获取最新区块
    const latestBlockhash = await conn.getLatestBlockhash();
    console.log(`最新区块哈希: ${latestBlockhash.blockhash}\n`);

    // 获取已解析的账户详细信息
    const accountInfo = await conn.getAccountInfo(new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj'), "confirmed");
    console.log("账户信息：", accountInfo)

    // 解析transaction
    const parsedTransaction = await conn.getParsedTransaction(
        '3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC', {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
    });
    console.log(`已解析的交易: ${JSON.stringify(parsedTransaction)}\n`);


    // 获取某个钱包最近limit笔交易
    const signatures = await conn.getSignaturesForAddress(new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
        limit: 3
    });
    console.log(`最近的3笔交易签名: ${JSON.stringify(signatures)}\n`);

    // 用于查询某个账户下所有的代币账户 
    const tokenAccountsByOwner = await conn.getTokenAccountsByOwner(
        new PublicKey("web3xFMwEPrc92NeeXdAigni95NDnnd2NPuajTirao2"), {
        mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
    }, "confirmed");
    console.log(`token账户: ${JSON.stringify(tokenAccountsByOwner)}\n`);

   // 获取token的供应量
    const supplyInfo = await conn.getTokenSupply(new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'));
    console.log(`Total supply: ${supplyInfo.value.amount}\n`); 


    // 批量获取某个程序账户下的所有账户信息
    // 获取代币mint地址为Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump的所有持有者
    const mintAddress = new PublicKey("Dp4fXozKtwgK1cL5KQeeNbuAgFpJtY3FbAvL8JrWpump")
    const accounts = await conn.getParsedProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
        filters: [
            {
                dataSize: 165, // Token 账户的数据大小是 165 字节
            },
            {
                memcmp: {
                    offset: 0, // 0 偏移表示 Token Mint 地址的位置
                    bytes: mintAddress.toBase58(),
                },
            },
        ],
    });

    // 只打印3个持有者
    console.log("前3个账户:",  accounts.slice(0, 3))

}


// 解析二进制数据，通过数据格式和偏移量的方式强行计算某个特定值
// 解析WSOL/USDC流动池中WSOL的USDC相对价格
export async function parseRawData() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const poolAccountPublicKey = new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj');
    const accountInfo = await connection.getAccountInfo(poolAccountPublicKey);
    const dataBuffer = accountInfo?.data;
    if (!dataBuffer) {
        throw new Error("Account data not found");
    }
    console.log(dataBuffer);

    // sqrtPriceX64的起始偏移量应为 8+1+32∗7+1+1+2+16=253 
    const offset = 253;
    const sqrtPriceX64Buffer = dataBuffer.slice(offset, offset + 16); // 读取16个字节
    const sqrtPriceX64Value = new BN(sqrtPriceX64Buffer, 'le'); // 使用小端字节序创建BN实例
    console.log(`sqrtPriceX64Value at offset ${offset}:`, sqrtPriceX64Value.toString());

    // 计算价格
    const sqrtPriceX64BigInt = BigInt(sqrtPriceX64Value.toString());
    const sqrtPriceX64Float = Number(sqrtPriceX64BigInt) / (2 ** 64);
    const price = sqrtPriceX64Float ** 2 * 1e9 / 1e6;
    console.log(`WSOL价格:`,  price.toString()); 
}