import { Connection, PublicKey } from "@solana/web3.js";
import {isErr} from "../util";
import { GenerateWallet } from "./WalletGenerate";
import { MonitorWallet } from "./WalletMonitor";
import { LoadWallet } from "./WalletLoad";
import {runWithTimeout} from "../util"

describe('test wallet', () => {
    const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

    it('test WalletGenerate', () => {
        GenerateWallet("./test_wallet.json");
    });

    it("test WalletLoad", () => {
        const wallet = LoadWallet("./test_wallet.json");
        const publicKey = wallet.publicKey.toBase58();
        console.log(`钱包公钥: ${publicKey}`);
        console.log(`钱包私钥: ${wallet.secretKey}`);
        console.log(`私钥base64: ${Buffer.from(wallet.secretKey).toString("base64")}`);
    });

    it('test WalletMonitor', async() => {
        const publicKey = new PublicKey('orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8');
        await expect(runWithTimeout(() => MonitorWallet(conn, publicKey), 10000)).rejects.toThrow("timeout");
    });
});

