import { Connection, Keypair } from "@solana/web3.js";
import { initSdk } from "./config";
import { MonitorRaydiumNewPool } from "./monitorNewPool"
import { RaydiumSwap } from "./swap";
import bs58 from "bs58";
import BN from "bn.js";
import dotenv from "dotenv";

describe('test dex raydium', () => {
    it('test monitorRaydiumNewPool', () => {
        MonitorRaydiumNewPool();
    })

    it("test swap", async() => {
        dotenv.config();

        const secretKey = process.env.PRIVATE_KEY;
        if (!secretKey) {
            throw new Error("Missing PRIVATE_KEY in environment variables.");
        }

        const conn = new Connection("");
        const signer = Keypair.fromSecretKey(bs58.decode(secretKey));
        const raydium = await initSdk(conn, signer);
        const poolId = 'DiwsGxJYoRZURvyCtMsJVyxR86yZBBbSYeeWNm7YCmT6'  // RAY-USDC pool
        const tokenMintA = "";
        const tokenMintB = "";
        const amount = new BN(100);
        RaydiumSwap(conn, raydium, signer, poolId, tokenMintA, tokenMintB, amount);
    })
})
