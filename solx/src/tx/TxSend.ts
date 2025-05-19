import {AddressLookupTableProgram, ComputeBudgetProgram, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionMessage, VersionedTransaction} from "@solana/web3.js"
import fs from "fs";

export async function SendTx() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf8")));
    const fromWallet = Keypair.fromSecretKey(fromSecretKey);

    const tx = new Transaction();
    const toAddress = new PublicKey("buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ");

    const instruction = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1, // 1000 lamports
    });
    tx.add(instruction);

    const simulateResult = await connection.simulateTransaction(tx, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // sendAndConfirmTransaction
    const signature1 = await sendAndConfirmTransaction(connection, tx, [fromWallet], { 
        skipPreflight: false 
    });
    console.log(`交易已发送: https://solscan.io/tx/${signature1}`);

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromWallet.publicKey;
    tx.sign(fromWallet);
    const rawTransaction = tx.serialize();

    // sendRawTransaction
    const signature2 = await connection.sendRawTransaction(rawTransaction, { 
        skipPreflight: false   // 模拟交易 
    })
    console.log("交易签名：", signature2)
    
    // sendEncodedTransaction
    const base64Transaction = rawTransaction.toString('base64');
    const signature3 = await connection.sendEncodedTransaction(base64Transaction, { 
        skipPreflight: false 
    });
    console.log("交易签名：", signature3)
}