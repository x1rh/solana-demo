import { Keypair } from "@solana/web3.js"
import fs from "fs";

// loadWallet: 从本地文件导入钱包
export function LoadWallet(path?: string): Keypair {
    if(!path) {
        path = "wallet.json";
    }
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(path, "utf8")));
    const kp = Keypair.fromSecretKey(secretKey);
    return kp;
}
