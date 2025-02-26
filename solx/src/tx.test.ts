import { gasFeeExample, listen, sendTransaction, v0Transaction } from "./tx";

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
})