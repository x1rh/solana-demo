import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from "@solana/web3.js"
import BN  from "bn.js";


// 监听WSOL/USDC交易对WSOL的价格
export async function TokenPriceMonitor() {
   const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

    connection.onAccountChange(
        new PublicKey('8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj'),
        async (accountInfo) => {
            const dataBuffer = accountInfo?.data;
            if (!dataBuffer) {
                throw new Error("Account data not found");
            }

            const offset = 253
            const sqrtPriceX64Buffer = dataBuffer.slice(offset, offset + 16); // 读取16个字节
            const sqrtPriceX64Value = new BN(sqrtPriceX64Buffer, 'le'); // 使用小端字节序创建BN实例
            console.log(`sqrtPriceX64Value at offset ${offset}:`, sqrtPriceX64Value.toString());

            // 计算价格
            const sqrtPriceX64BigInt = BigInt(sqrtPriceX64Value.toString());
            const sqrtPriceX64Float = Number(sqrtPriceX64BigInt) / (2 ** 64);
            const price = sqrtPriceX64Float ** 2 * 1e9 / 1e6;
            console.log(`WSOL价格:`, price.toString())
            console.log('---\n')
        },
        'confirmed'
    ); 
}