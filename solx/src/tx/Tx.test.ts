import { Connection } from "@solana/web3.js";
import { GasFeeExample } from "./TxCu";
import { ListenTx } from "./TxListener";
import { ParseTx } from "./TxParser";
import { ParseRawData } from "./TxParseRawData";
import { SendTx } from "./TxSend";
import { SendV0Tx } from "./TxV0Send";

describe('test tx', () => {
    const conn = new Connection("https://api.mainnet-beta.solana.com");

    it('test TxCU', () => {
        GasFeeExample();
    });

    it('test TxListener', () => {
        ListenTx();
    });

    it("test TxParser", async() => {
       // 解析transaction
        const signature = '3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC';
        const commitment = "confirmed";
        const maxSupportedTransactionVersion = 0;
        const parsedTransaction = await ParseTx(conn, signature, commitment, maxSupportedTransactionVersion);
    });

    it("test TxParseRawData", () => {
        ParseRawData();
    });

    it("test TxSend", async() => {
        SendTx();
    });

    it("test TxV0Send", async() => {
        SendV0Tx();
    });
})