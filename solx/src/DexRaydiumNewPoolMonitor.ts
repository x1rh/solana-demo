import {Connection, PublicKey} from "@solana/web3.js"


// 监听raydium新流动池的创建 
export async function MonitorRaydiumNewPool() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const raydiumV4PublicKey = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');
    connection.onLogs(
        raydiumV4PublicKey,
        ({ logs, err, signature }) => {
            if(err) {
                return;
            }
            if(logs && logs.some(log => log.includes("initialize2"))) {
                console.log(`新流动池被创建: https://solscan.io/tx/${signature}`);
            }
        },
        "confirmed"
    );
}

