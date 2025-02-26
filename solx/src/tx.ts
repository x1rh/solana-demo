import {AddressLookupTableProgram, ComputeBudgetProgram, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionMessage, VersionedTransaction} from "@solana/web3.js"
import fs from "fs";

export async function sendTransaction() {
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


export async function listen() {
    const conn = new Connection("https://api.mainnet-beta.solana.com");

    // onAccountChange
    const wallet = new PublicKey("orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8");
    conn.onAccountChange(wallet, (accountInfo) => {
        console.log(`change: ${JSON.stringify(accountInfo)}`);
    });

    // onProgramAccountChange
    const programAddress = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");
    conn.onProgramAccountChange(programAddress, (change) => {
        console.log(`change: ${JSON.stringify(change)}`);
    });

    const account = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8");
    conn.onLogs(account, (_logs) => {
        console.log(`logs: ${_logs}`);
    });
}

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

// 版本化交易（Versioned Transactions）或称 v0 交易是Solana更新过程中引入的一种新的交易类型。
// 因传统（legacy）交易账户数量的限制，v0 交易中引入了地址查找表（Address Lookup Tables）功能，用于压缩账户数量，将账户数量限制由35个提升到了64个。
// address lookup table（ALT）
export async function v0Transaction() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("wallet.json", "utf8")));
    const payer = Keypair.fromSecretKey(secretKey);

    // 创建ALT
    async function createALT() {
        const slot = await connection.getSlot("confirmed");
        const [lookupTableInstruction, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
            authority: payer.publicKey,
            payer: payer.publicKey,
            recentSlot: slot,
        });
        console.log("lookup table address:", lookupTableAddress.toBase58());

        // 创建v0 message
        const { blockhash } = await connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash, // 最近的区块hash
            instructions: [lookupTableInstruction], // 指令数组
        }).compileToV0Message();

        // 创建v0交易并签名
        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([payer]);

        const simulateResult = await connection.simulateTransaction(transaction);
        console.log("模拟交易结果: ", simulateResult);

        const signature = await connection.sendTransaction(transaction);
        console.log(`交易已发送: https://solscan.io/tx/${signature}`);
    }


    // 添加地址到ALT中
    async function addAddressesToALT() {
        const lookupTableAddress = new PublicKey('2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5')

        // 添加账户到ALT
        const extendInstruction = AddressLookupTableProgram.extendLookupTable({
            lookupTable: lookupTableAddress,
            payer: payer.publicKey,
            authority: payer.publicKey,
            // 地址列表:
            addresses: [
                payer.publicKey,
                new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ'),
                SystemProgram.programId, // 
            ],
        });

        // 创建v0 message
        const { blockhash } = await connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash, // 最近的区块hash
            instructions: [extendInstruction], // 指令数组
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([payer]);

        const simulateResult = await connection.simulateTransaction(transaction);
        console.log("模拟交易结果: ", simulateResult);

        const signature = await connection.sendTransaction(transaction);
        console.log(`交易已发送: https://solscan.io/tx/${signature}`);
    }


    // 转账时使用ALT（这个例子不明显）
    async function transfer() {
        const lookupTableAddress = new PublicKey('2qqXrZZSG9naivqMyWHHUDRFVNh3YthsTbN5EPU8Poo5')
        const ALT = await connection.getAddressLookupTable(lookupTableAddress);
        const lookupTableAccount = ALT.value;
        if (!ALT.value) {
            throw new Error("lookupTableAccount不存在");
        }
        console.log('lookupTableAccount:', lookupTableAccount)

        const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');
        const instruction = SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: toAddress,
            lamports: 1000, // 1000 lamports
        });

        const { blockhash } = await connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash, // 最近的区块hash
            instructions: [instruction], // 指令数组
        }).compileToV0Message([lookupTableAccount!]);

        const transaction = new VersionedTransaction(messageV0);
        transaction.sign([payer]);

        const simulateResult = await connection.simulateTransaction(transaction);
        console.log("模拟交易结果: ", simulateResult);

        const signature = await connection.sendTransaction(transaction);
        console.log(`交易已发送: https://solscan.io/tx/${signature}`);
    }

    async function parseTx() {
        const parsedTransaction1 = await connection.getParsedTransaction('4LwygRtiF9ZCrbGKoh8MEzmxowaRHPaDc1nsinkv72uXU2cUCuZ8YskBBgsvbBEMZ5Pqpf6C6WcXtCkqAuLZand1', {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        });
        console.log(`已解析的v0交易: ${JSON.stringify(parsedTransaction1)}\n`);
    }

    createALT();
    addAddressesToALT();
    transfer();
    parseTx();
}

