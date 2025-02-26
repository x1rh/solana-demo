import {Connection, Keypair, PublicKey} from "@solana/web3.js"
import fs from "fs";
import {Buffer} from "buffer";
import {Result} from "./util" 

// generateWallet: 生成key pair并保存
export function generateWallet() {
    const wallet = Keypair.generate();
    const publicKey = wallet.publicKey.toBase58();
    const secretKey = wallet.secretKey;

    console.log(`钱包公钥: ${publicKey}`);
    console.log(`钱包私钥: ${secretKey}`);
    console.log(`私钥base64: ${Buffer.from(secretKey).toString("base64")}`);

    fs.writeFileSync("wallet.json", JSON.stringify(Array.from(secretKey)));
}

// loadWallet: 从本地文件导入钱包
export function loadWallet(): Result<Keypair, Error> {
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf8")));
    const wallet = Keypair.fromSecretKey(secretKey);
    return {value: wallet};
}

// 结合 onAccountChange 和 getSignaturesForAddress 方法来订阅指定账户的改变并获取指定账户的最新交易
export async function monitorWallet(publicKey: PublicKey) {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    connection.onAccountChange(
        publicKey,
        async () => {
            const sig = await connection.getSignaturesForAddress(publicKey, {limit: 1}, 'confirmed');
            console.log(sig);
        },
        'confirmed'
    );

    // async function test() {
    //     const sig = await connection.getSignaturesForAddress(publicKey, {limit: 1}, 'confirmed');
    //     await sendMessage(`新交易！\n\nhttps://solscan.io/tx/${sig[0].signature}`)
    // }
    // test();
}

