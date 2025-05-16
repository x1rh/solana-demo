import {Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js"
import BN  from "bn.js";


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