import { PublicKey } from "@solana/web3.js";
import {isErr} from "./util";
import { generateWallet, loadWallet, monitorWallet } from "./WalletMonitor";

describe('wallet', () => {
    it('generate wallet', () => {
        generateWallet();
    });

    it('load wallet', () => {
        const result = loadWallet();
        if(isErr(result)) {
            console.log(result.error);
            return;
        } 
        const wallet = result.value;
        const publicKey = wallet.publicKey.toBase58();
        console.log(`钱包公钥: ${publicKey}`);
        console.log(`钱包私钥: ${wallet.secretKey}`);
        console.log(`私钥base64: ${Buffer.from(wallet.secretKey).toString("base64")}`);
    })

    it('monitor wallet', () => {
        const publicKey = new PublicKey('orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8');
        monitorWallet(publicKey);
    })
});

