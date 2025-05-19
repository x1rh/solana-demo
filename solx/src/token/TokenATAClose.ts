import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from "@solana/web3.js"
import BN  from "bn.js";



// 当您的钱包中持有新代币时，都会为其创建一个特定的代币帐户。每次创建一个账户，都会支付约0.002 SOL的租金。本工具可帮你一键退租。
export async function CloseATA() {
    // https://github.com/ChainBuff/solana-web3js/blob/main/example-05-closeATA/index.js
}