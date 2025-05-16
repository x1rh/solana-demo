import {AddressLookupTableProgram, ComputeBudgetProgram, Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionMessage, VersionedTransaction} from "@solana/web3.js"
import fs from "fs";


export async function listenTx() {
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