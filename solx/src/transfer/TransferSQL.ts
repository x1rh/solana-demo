import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from "@solana/web3.js"

export async function TransferSOL() {
   const wallet = Keypair.generate(); 
   const conn = new Connection("https://api.mainnet-beta.solana.com");

    const tx = new Transaction();
    const receiver = new PublicKey("mmkyprqAN3ukTQF78ck8F9K5UfN8t9qQLet8RRVTcaC");
    const instruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: receiver,
        lamports: 1,
    })
    tx.add(instruction);

    const simulateResult = await conn.simulateTransaction(tx, [wallet]);
    console.log("simulate result: ", simulateResult);

    const signature = await sendAndConfirmTransaction(conn, tx, [wallet]);
    console.log(`tx status: https://solscan.io/tx/${signature}`);
}
