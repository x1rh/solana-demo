import { gasFeeExample, listen, sendTransaction, v0Transaction } from "./TxV0Send";

describe('transaction', () => {
    it('send transaction', () => {
        sendTransaction();
    });

    it('listen', () => {
        listen();
    });

    it('gas fee example', () => {
        gasFeeExample();
    })

    it('v0 transaction', () => {
        v0Transaction();
    });

    it("test tx parser", () => {
       // 解析transaction
        const parsedTransaction = await conn.getParsedTransaction(
            '3Vfp5qPhF14bNb2jLtTccabCDbHUmxqtXerUvPEjKb6RpJ8jU3H9M9JgcUbDPtgesB3WFP9M8VZTzECgBavnjxaC', {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        });
    })
})