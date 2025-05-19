import {Keypair} from "@solana/web3.js"
import fs from "fs";
import {Buffer} from "buffer";

// generateWallet: 生成key pair并保存
// savePath格式：xxx/xxx/wallet.json
export function GenerateWallet(savePath?: string) {
    const wallet = Keypair.generate();
    const publicKey = wallet.publicKey.toBase58();
    const secretKey = wallet.secretKey;

    console.log(`钱包公钥: ${publicKey}`);
    console.log(`钱包私钥: ${secretKey}`);
    console.log(`私钥base64: ${Buffer.from(secretKey).toString("base64")}`);
    if(savePath) {
        fs.writeFileSync(savePath, JSON.stringify(Array.from(secretKey)));
    }
}