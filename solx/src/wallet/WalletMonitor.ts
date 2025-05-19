import {Connection, Keypair, PublicKey} from "@solana/web3.js"
import fs from "fs";
import {Buffer} from "buffer";
import {Result} from "../util" 


// 结合 onAccountChange 和 getSignaturesForAddress 方法来订阅指定账户的改变并获取指定账户的最新交易
export async function MonitorWallet(
    conn: Connection,
    publicKey: PublicKey,
) {
    conn.onAccountChange(
        publicKey,
        async () => {
            const sig = await conn.getSignaturesForAddress(publicKey, {limit: 1}, 'confirmed');
            console.log(sig);
            // await sendMessage(`新交易！\n\nhttps://solscan.io/tx/${sig[0].signature}`)
        },
        'confirmed'
    );
}

