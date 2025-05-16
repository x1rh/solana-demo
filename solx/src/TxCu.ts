import {AddressLookupTableProgram, ComputeBudgetProgram, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionMessage, VersionedTransaction} from "@solana/web3.js"
import fs from "fs";


// setComputeUnitPrice()
// setComputeUnitLimit() 
// 一般情况下，需要对自己的交易CU数量占用有所预估，固定此值，来灵活的调整CU价格参数，以此来保证优先执行
export async function gasFeeExample() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

    const fromSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf8")));
    const fromWallet = Keypair.fromSecretKey(fromSecretKey);

    const transaction = new Transaction();

    // CU价格
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5
    });
    transaction.add(computeUnitPriceInstruction);

    // CU数量
    const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 500,
    });
    transaction.add(computeUnitLimitInstruction);

    const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // // 添加转账指令
    // const instruction2 = SystemProgram.transfer({
    //     fromPubkey: fromWallet.publicKey,
    //     toPubkey: toAddress,
    //     lamports: 1000, // 1000 lamports
    // });
    // transaction.add(instruction2);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);

}