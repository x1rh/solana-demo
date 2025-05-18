import { Connection, PublicKey } from "@solana/web3.js";
import {isErr} from "./util";
import { MonitorWallet } from "./WalletMonitor";
import { GenerateWallet } from "./WalletGenerate";
import { LoadWallet } from "./WalletLoad";

describe('test wallet', () => {
    const conn = new Connection("");

    it('test WalletGenerate', () => {
        GenerateWallet();
    });

    it("test WalletLoad", () => {
        const result = LoadWallet();
        if(isErr(result)) {
            console.log(result.error);
            return;
        } 
        const wallet = result.value;
        const publicKey = wallet.publicKey.toBase58();
        console.log(`钱包公钥: ${publicKey}`);
        console.log(`钱包私钥: ${wallet.secretKey}`);
        console.log(`私钥base64: ${Buffer.from(wallet.secretKey).toString("base64")}`);
    });

    it('test WalletMonitor', () => {
        const publicKey = new PublicKey('orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8');
        MonitorWallet(publicKey);
    });
});

