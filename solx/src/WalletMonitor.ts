import {Connection, Keypair, PublicKey} from "@solana/web3.js"
import fs from "fs";
import {Buffer} from "buffer";
import {Result} from "./util" 


// 结合 onAccountChange 和 getSignaturesForAddress 方法来订阅指定账户的改变并获取指定账户的最新交易
export async function MonitorWallet(publicKey: PublicKey) {
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

