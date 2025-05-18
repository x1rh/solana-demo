import {Connection, Keypair, PublicKey} from "@solana/web3.js"
import fs from "fs";
import {Buffer} from "buffer";
import {Result} from "./util" 



// loadWallet: 从本地文件导入钱包
export function LoadWallet(): Result<Keypair, Error> {
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf8")));
    const wallet = Keypair.fromSecretKey(secretKey);
    return {value: wallet};
}