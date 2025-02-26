import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from "@solana/web3.js"
import BN  from "bn.js";

export async function transferSOL() {
   const wallet = Keypair.generate(); 
   const conn = new Connection("https://api.mainnet-beta.solana.com");

    const tx = new Transaction();
    const receiver = new PublicKey("mmkyprqAN3ukTQF78ck8F9K5UfN8t9qQLet8RRVTcaC");
    const instruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: receiver,
        lamports: 1,
    })
    tx.add(instruction);

    const simulateResult = await conn.simulateTransaction(tx, [wallet]);
    console.log("simulate result: ", simulateResult);

    const signature = await sendAndConfirmTransaction(conn, tx, [wallet]);
    console.log(`tx status: https://solscan.io/tx/${signature}`);
}


// 监听WSOL/USDC交易对WSOL的价格
export async function monitorTokenPrice() {
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

// 分析token的holder情况
export async function analysisTokenHolders() {
   // https://github.com/ChainBuff/solana-web3js/blob/main/example-04-analysisToken/index.ts 
}

// 当您的钱包中持有新代币时，都会为其创建一个特定的代币帐户。每次创建一个账户，都会支付约0.002 SOL的租金。本工具可帮你一键退租。
export async function closeATA() {
    // https://github.com/ChainBuff/solana-web3js/blob/main/example-05-closeATA/index.js
}